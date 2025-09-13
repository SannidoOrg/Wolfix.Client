"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterSellerDto } from "@/types/auth";
import Step1PersonalInfo from "./Registration/Step1StoreInfo";
import Step2AddressAndAccount from "./Registration/Step2ContactInfo";

const SellerRegistrationForm = () => {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { registerSeller } = useAuth();
    const [formData, setFormData] = useState<Omit<RegisterSellerDto, 'document'>>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: "",
        city: "",
        street: "",
        houseNumber: "",
        apartmentNumber: "",
        birthDate: "",
    });
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        const finalData: RegisterSellerDto = {
            ...formData,
            document: documentFile || undefined,
        };
        const success = await registerSeller(finalData);
        if (success) {
            router.push("/seller/dashboard");
        }
    };

    return (
        <div className="seller-form-wrapper">
            {step === 1 && (
                <Step1PersonalInfo
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNext}
                />
            )}
            {step === 2 && (
                <Step2AddressAndAccount
                    formData={formData}
                    setFormData={setFormData}
                    setDocumentFile={setDocumentFile}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default SellerRegistrationForm;