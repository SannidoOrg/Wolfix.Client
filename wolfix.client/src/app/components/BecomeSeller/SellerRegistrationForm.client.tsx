"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SellerApplicationDto } from "@/types/auth";
import Step1PersonalInfo from "./Registration/Step1PersonalInfo";
import Step2AddressAndAccount from "./Registration/Step2AddressAndAccount";

const SellerRegistrationForm = () => {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { user, createSellerApplication } = useAuth();
    const [formData, setFormData] = useState<Omit<SellerApplicationDto, 'document'>>({
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

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                middleName: user.middleName || "",
                phoneNumber: user.phoneNumber || "",
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
                city: user.address?.city || "",
                street: user.address?.street || "",
                houseNumber: user.address?.houseNumber || "",
                apartmentNumber: user.address?.apartmentNumber || "",
            }));
        }
    }, [user]);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        const finalData: SellerApplicationDto = {
            ...formData,
            document: documentFile || undefined,
        };
        const success = await createSellerApplication(finalData);
        if (success) {
            router.push("/profile");
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