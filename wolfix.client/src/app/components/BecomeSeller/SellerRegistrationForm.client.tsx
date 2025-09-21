"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SellerApplicationDto, Category } from "@/types/auth";
import api from "@/lib/api";
import Step1PersonalInfo from "./Registration/Step1PersonalInfo";
import Step2AddressAndAccount from "./Registration/Step2AddressAndAccount";

const SellerRegistrationForm = () => {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { user, createSellerApplication } = useAuth();
    
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [childCategories, setChildCategories] = useState<Category[]>([]);
    const [selectedParent, setSelectedParent] = useState<string>('');

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
        categoryId: "",
        categoryName: "",
    });
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const response = await api.get<Category[]>("/api/categories/parent");
                setParentCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch parent categories", error);
            }
        };
        fetchParentCategories();
    }, []);

    useEffect(() => {
        const fetchChildCategories = async () => {
            if (selectedParent) {
                try {
                    const response = await api.get<Category[]>(`/api/categories/child/${selectedParent}`);
                    setChildCategories(response.data);
                } catch (error) {
                    setChildCategories([]);
                    console.error("Failed to fetch child categories", error);
                }
            } else {
                setChildCategories([]);
            }
        };
        fetchChildCategories();
    }, [selectedParent]);

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
        if (!formData.categoryId) {
            alert("Будь ласка, оберіть дочірню категорію");
            return;
        }
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
                    parentCategories={parentCategories}
                    childCategories={childCategories}
                    selectedParent={selectedParent}
                    setSelectedParent={setSelectedParent}
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