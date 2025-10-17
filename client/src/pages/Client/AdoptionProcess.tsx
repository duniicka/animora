import React, { useRef, useEffect, useState, useMemo } from 'react';
import ThreeBackground from '../../components/Background/Background';
// Declaration for THREE.js global object access (for TypeScript)
declare global {
    interface Window {
        THREE: any;
    }
}

// --- Configuration and Data ---

const COLORS = {
    primaryTeal: '#009688', // Main teal color (used for headers, links, primary buttons)
    darkAccentGreen: '#00796B', // Accent color (used for adopt buttons, strong highlights)
    backgroundLight: '#F8F9FA', // General page background
    cardBackground: '#FFFFFF', // Card background color
};

const AdoptionStep: React.FC<{ step: number, title: string, description: string, icon: string }> = ({ step, title, description, icon }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:translate-y-[-2px] h-full">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.primaryTeal, color: 'white' }}>
            <span className="text-3xl font-bold">{step}</span>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.darkAccentGreen }}>{title}</h3>
        <p className="text-gray-600 text-sm flex-grow">{description}</p>
        <div className="mt-4 text-4xl" style={{ color: COLORS.primaryTeal }}>
            <i className={icon}></i> {/* Font Awesome icons */}
        </div>
    </div>
);

const AdoptionProcessPage: React.FC = () => {
    // Mock FAQ data for accordion
    const faqs = [
        { question: "Proses nə qədər vaxt aparır?", answer: "Ərizənin təsdiqindən heyvanın evinə getməsinə qədər adətən 5-10 iş günü çəkir, lakin bu, ev yoxlaması sürətindən asılıdır." },
        { question: "Kirayə evdə yaşayıram, övladlığa götürə bilərəmmi?", answer: "Bəli, lakin bizdən əvvəl mütləq ev sahibinizdən heyvan saxlamağa icazəniz olduğunu təsdiq edən sənəd tələb olunur." },
        { question: "Övladlığa götürmə haqqı nə qədərdir?", answer: "Haqlər heyvanın növünə və yaşına görə dəyişir. Bu haqq peyvənd, sterilizasiya/kastrasiya və mikroçip xərclərini ödəyir." },
    ];

    return (
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-3" style={{ color: COLORS.darkAccentGreen }}>
                    Övladlığa Götürmə Prosesi
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Ev heyvanı götürməyə qərar verdiniz? Hər addımda sizə rəhbərlik edəcəyik.
                </p>
            </div>

            {/* Step-by-Step Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
                <AdoptionStep
                    step={1}
                    title="Ərizəni Doldurun"
                    description="Kompüter və ya mobil telefon vasitəsilə qısa övladlığa götürmə ərizəsini doldurun."
                    icon="fas fa-file-alt"
                />
                <AdoptionStep
                    step={2}
                    title="İlkin Nəzərdən Keçirmə"
                    description="Komandamız müraciətinizi nəzərdən keçirir və sizinlə telefon vasitəsilə əlaqə saxlayır."
                    icon="fas fa-phone-alt"
                />
                <AdoptionStep
                    step={3}
                    title="Tanışlıq Görüşü"
                    description="Heyvanla görüşüb, onun sizin həyat tərzinizə uyğun olub-olmadığını yoxlayın."
                    icon="fas fa-handshake"
                />
                <AdoptionStep
                    step={4}
                    title="Ev Yoxlaması"
                    description="Təhlükəsiz və sevgi dolu bir ev təmin etdiyinizdən əmin olmaq üçün qısa səfər."
                    icon="fas fa-home"
                />
                <AdoptionStep
                    step={5}
                    title="Götürmə və Dəstək"
                    description="Müqaviləni imzalayın. Proses bitdikdən sonra da dəstəyimiz davam edir."
                    icon="fas fa-paw"
                />
            </div>

            {/* Call to Action & Application Link */}
            <div className="text-center mb-16 p-10 rounded-xl shadow-2xl" style={{ backgroundColor: COLORS.primaryTeal, color: 'white' }}>
                <h2 className="text-3xl font-bold mb-4">Hazırsınız? İlk Addımı Atın!</h2>
                <p className="text-lg mb-6 max-w-3xl mx-auto">
                    Ərizəni doldurmaqla övladlığa götürmə səyahətinizə başlayın. Bu, təxminən 10 dəqiqə çəkəcək.
                </p>
                <button
                    className="text-white font-extrabold text-xl px-10 py-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                    style={{ backgroundColor: COLORS.darkAccentGreen }}
                    onClick={() => console.log('Navigating to Application Form')}
                >
                    Ərizə Formasına Keçid <i className="fas fa-arrow-right ml-2"></i>
                </button>
            </div>

            {/* FAQ Section (Accordion) */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: COLORS.darkAccentGreen }}>
                    Tez-tez Verilən Suallar (FAQ)
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="p-4 bg-white rounded-xl shadow-md border-l-4"
                            style={{ borderColor: COLORS.primaryTeal }}
                        >
                            <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center text-gray-800">
                                {faq.question}
                                <i className="fas fa-chevron-down text-sm ml-2"></i>
                            </summary>
                            <p className="mt-3 ml-2 text-gray-600 border-t pt-3">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </main>
    );
}
const AdoptionProcess: React.FC = () => {

    return (
        <>
            <div className="text-gray-800 relative min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
                <ThreeBackground />
                <AdoptionProcessPage />
            </div>
        </>
    );
};

export default AdoptionProcess;
