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

type Page = 'pets' | 'adoption' | 'about'; 

// Mock Pet Data (unchanged)
interface TeamMember {
    name: string;
    role: string;
    imageText: string;
}

const mockTeam: TeamMember[] = [
    { name: "Aynur Qasımova", role: "Təsisçi & İdarəedici Direktor", imageText: "Aynur+Director" },
    { name: "Cavid Rzayev", role: "Vəkillik və Qəbul Proqramları", imageText: "Cavid+Advocate" },
    { name: "Lalə Məmmədli", role: "Könüllü Koordinatoru", imageText: "Lala+Coordinator" },
];
interface Testimonial {
    quote: string;
    author: string;
    city: string;
}

const mockTestimonials: Testimonial[] = [
    {
        quote: "Maksı övladlığa götürdükdən sonra həyatımız tamamilə dəyişdi. Paws & Purpose komandasının dəstəyi inanılmaz idi!",
        author: "Nigar Əliyeva",
        city: "Bakı",
    },
    {
        quote: "Övladlığa götürmə prosesi çox peşəkar və sürətli idi. Onlar heyvanları üçün ən yaxşısını istəyirlər.",
        author: "Fərid Quliyev",
        city: "Sumqayıt",
    },
    {
        quote: "Mənim tək ehtiyacım olan bir dost idi və Luna mənə bunu verdi. Bu təşkilata minnətdaram.",
        author: "Aysel Həsənova",
        city: "Gəncə",
    },
];

interface ImpactArea {
    title: string;
    description: string;
    icon: string;
    percentage: number;
}

const mockImpactAreas: ImpactArea[] = [
    { title: "Tibbi Qulluq & Peyvəndlər", description: "Yaralı və xəstə heyvanların müalicəsi, bütün peyvəndlərin təmin edilməsi.", icon: "fas fa-stethoscope", percentage: 40 },
    { title: "Qida & Yaşayış Xərcləri", description: "Gündəlik qida, isti sığınacaq və təmizlik üçün istifadə olunur.", icon: "fas fa-bowl-food", percentage: 35 },
    { title: "Övladlığa Götürmə Proqramları", description: "Prosesin idarə edilməsi, maarifləndirmə və yeni sahiblərlə əlaqə.", icon: "fas fa-handshake-angle", percentage: 15 },
    { title: "Təcili Ehtiyat Fondu", description: "Gözlənilməz böyük əməliyyatlar və ya təcili xilasetmə əməliyyatları.", icon: "fas fa-shield-virus", percentage: 10 },
];
const ImpactCard: React.FC<{ number: string, description: string, icon: string }> = ({ number, description, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 text-center transition duration-300 hover:bg-gray-50" style={{ borderColor: COLORS.primaryTeal }}>
        <i className={`${icon} text-4xl mb-3`} style={{ color: COLORS.darkAccentGreen }}></i>
        <p className="text-5xl font-extrabold mb-1" style={{ color: COLORS.darkAccentGreen }}>{number}</p>
        <p className="text-lg text-gray-600 font-medium">{description}</p>
    </div>
);

const DonationImpactCard: React.FC<{ area: ImpactArea }> = ({ area }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 transition duration-300 hover:shadow-xl" style={{ borderColor: COLORS.darkAccentGreen }}>
        <div className="flex items-center mb-4">
            <i className={`${area.icon} text-3xl mr-4`} style={{ color: COLORS.primaryTeal }}></i>
            <h3 className="text-xl font-bold" style={{ color: COLORS.darkAccentGreen }}>{area.title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">{area.description}</p>
        
        {/* Progress Bar */}
        <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full uppercase" style={{ backgroundColor: COLORS.primaryTeal, color: 'white' }}>
                    {area.percentage}%
                </span>
                <span className="text-xs font-semibold inline-block text-gray-500">
                    Ümumi Xərclərin
                </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded" style={{ backgroundColor: '#E0E0E0' }}>
                <div 
                    style={{ width: `${area.percentage}%`, backgroundColor: COLORS.darkAccentGreen }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                ></div>
            </div>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-white p-8 rounded-xl shadow-xl transition duration-300 transform hover:shadow-2xl border-l-4" style={{ borderColor: COLORS.darkAccentGreen }}>
        <i className="fas fa-quote-left text-3xl mb-4" style={{ color: COLORS.primaryTeal }}></i>
        <p className="text-gray-700 italic mb-4 text-md leading-relaxed">
            "{testimonial.quote}"
        </p>
        <div className="text-right border-t pt-3">
            <p className="font-bold" style={{ color: COLORS.darkAccentGreen }}>{testimonial.author}</p>
            <p className="text-sm text-gray-500">{testimonial.city}</p>
        </div>
    </div>
);

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
    // Placeholder image URL for team members
    const imageUrl = `https://placehold.co/200x200/90EE90/00796B?text=${member.imageText.replace(/\s/g, '+')}`;
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center transition duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <img 
                src={imageUrl} 
                alt={member.name} 
                className="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-4" 
                style={{ borderColor: COLORS.primaryTeal }}
            />
            <h3 className="text-xl font-bold" style={{ color: COLORS.darkAccentGreen }}>{member.name}</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">{member.role}</p>
            <div className="flex justify-center space-x-3 mt-3 text-lg">
                <a href="#" className="hover:text-gray-700" style={{ color: COLORS.primaryTeal }}><i className="fab fa-linkedin"></i></a>
                <a href="#" className="hover:text-gray-700" style={{ color: COLORS.primaryTeal }}><i className="fab fa-twitter"></i></a>
            </div>
        </div>
    );
};


const AboutPage: React.FC = () => (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Giriş & Missiya Bölməsi */}
        <section className="text-center mb-16 p-12 rounded-2xl shadow-xl" style={{ backgroundColor: COLORS.cardBackground }}>
            <h1 className="text-5xl font-extrabold mb-4" style={{ color: COLORS.darkAccentGreen }}>
                Biz Kimik?
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                "Paws & Purpose" olaraq, bizim missiyamız Azərbaycanda sahibsiz heyvanların həyatını dəyişməkdir. Biz hər bir canlının sevgi dolu, təhlükəsiz bir evə layiq olduğuna inanırıq. Sığınacaq təmin etməklə yanaşı, həm də icmamızı heyvan hüquqları və məsuliyyətli sahiblik barədə maarifləndiririk.
            </p>
        </section>

        {/* Təsir Metrikləri (Impact Metrics) */}
        <section className="mb-16">
            <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: COLORS.primaryTeal }}>
                Bizim Təsirimiz Rəqəmlərdə
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ImpactCard 
                    number="420+" 
                    description="Övladlığa Götürülən Heyvanlar" 
                    icon="fas fa-heart" 
                />
                <ImpactCard 
                    number="250+" 
                    description="Könüllü Saatları" 
                    icon="fas fa-clock" 
                />
                <ImpactCard 
                    number="98%" 
                    description="Sağlamlıqla Təminat" 
                    icon="fas fa-shield-alt" 
                />
            </div>
        </section>
        
        {/* YENİ: Dəstəyin Hərə Getdiyi (Where Your Support Goes) Bölməsi */}
        <section className="mb-16">
            <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: COLORS.darkAccentGreen }}>
                Dəstəyiniz Hara Gedir?
            </h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10">
                Şəffaflıq bizim üçün vacibdir. Bağışlarınızın hər bir qəpiyini heyvanlarımızın rifahı üçün necə xərclədiyimizi görün.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mockImpactAreas.map((area, index) => (
                    <DonationImpactCard key={index} area={area} />
                ))}
            </div>
        </section>


        {/* Müştəri Rəyləri (Testimonials) Bölməsi */}
        <section className="mb-16">
            <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: COLORS.darkAccentGreen }}>
                İnsanlar Bizim Haqqımızda Nə Düşünür?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {mockTestimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                ))}
            </div>
        </section>

        {/* Komanda Bölməsi (Team Section) */}
        <section className="mb-16">
            <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: COLORS.primaryTeal }}>
                Komandamızla Tanış Olun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mockTeam.map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                ))}
            </div>
        </section>
        
        {/* Əlaqə & Fəaliyyətə Çağırış */}
         <section className="text-center p-10 rounded-xl shadow-2xl" style={{ backgroundColor: COLORS.primaryTeal, color: 'white' }}>
            <h2 className="text-3xl font-bold mb-4">Siz də Bir Hissəsi Olun!</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
                Missiyamıza qoşulun. Hədiyyə edin, könüllü olun və ya sadəcə bu dəyərli işi başqaları ilə paylaşın.
            </p>
            <a href="#" className="text-white font-extrabold text-xl px-10 py-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                style={{ backgroundColor: COLORS.darkAccentGreen }}
                onClick={() => console.log('Navigating to Donate Page')}
            >
                Bizə Dəstək Olun <i className="fas fa-hand-holding-heart ml-2"></i>
            </a>
        </section>

    </main>
);

// --- Main App Component (Routing) ---

const About: React.FC = () => {
    return (
        <div className="text-gray-800 relative min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            
            {/* 3D Background Component (Subtle) */}
            <ThreeBackground /> 
            
            {/* Dynamic Content Area */}
            <AboutPage />
            
        </div>
    );
};

export default About;
