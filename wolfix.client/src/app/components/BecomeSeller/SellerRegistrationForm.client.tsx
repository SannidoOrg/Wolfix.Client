"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterSellerDto } from "@/types/auth";
import Step1StoreInfo from "./Registration/Step1StoreInfo";
import Step2ContactInfo from "./Registration/Step2ContactInfo";

const SellerRegistrationForm = () => {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { registerSeller } = useAuth();
    const [formData, setFormData] = useState<RegisterSellerDto>({
        companyName: "",
        siteUrl: "",
        fullName: "",
        position: "",
        email: "",
        phoneNumber: "",
        password: "",
    });

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        const success = await registerSeller(formData);
        if (success) {
            router.push("/seller/dashboard");
        }
    };

    return (
        <div className="seller-form-wrapper">
            {step === 1 && (
                <Step1StoreInfo
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNext}
                />
            )}
            {step === 2 && (
                <Step2ContactInfo
                    formData={formData}
                    setFormData={setFormData}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default SellerRegistrationForm;