import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

// --- Магнитный эффект для кнопки «Да» ---
const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouse = (e) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * 0.3);
        y.set(middleY * 0.3);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
            className="inline-block relative z-10 w-full md:w-auto"
        >
            {children}
        </motion.div>
    );
};

// --- Парящие волшебные частицы для финальной страницы ---
const FloatingDust = () => {
    const particles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        size: Math.random() * 6 + 2,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: '100vh', x: `${p.x}vw`, opacity: 0 }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        width: p.size,
                        height: p.size,
                        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,209,220,0.5) 100%)',
                        borderRadius: '50%',
                        position: 'absolute',
                        boxShadow: '0 0 10px 2px rgba(255, 209, 220, 0.8)'
                    }}
                />
            ))}
        </div>
    );
};

// --- Страница 5 (Финальная отправка и показ результатов) ---
const Step5 = ({
                   activity,
                   customActivity,
                   food,
                   customFood,
                   mapLink,
                   date,
                   pageVariants
               }) => {
    const [isSent, setIsSent] = useState(false);
    const hasSentRef = useRef(false);

    const formattedDate = date ? new Date(date).toLocaleString('ru-RU', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'Дата не выбрана';

    const displayActivity = customActivity || activity;
    const displayFood = customFood || food;

    useEffect(() => {
        // Защита от двойного вызова в React 18 StrictMode
        if (hasSentRef.current) return;
        hasSentRef.current = true;

        const sendData = async () => {
            try {
                const apiUrl = import.meta.env?.VITE_API_URL
                    ? `${import.meta.env.VITE_API_URL}/api/invitation/submit`
                    : '/api/invitation/submit';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        activity: displayActivity || '',
                        customActivity: customActivity || '',
                        restaurant: displayFood || '',
                        customRestaurant: customFood || '',
                        mapLink: mapLink || '',
                        date: formattedDate,
                        time: date ? new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''
                    }),
                });

                if (response.ok) {
                    setIsSent(true);
                }
            } catch (error) {
                console.error('Ошибка отправки данных в Telegram:', error);
            }
        };

        sendData();
    }, [displayActivity, customActivity, displayFood, customFood, mapLink, date, formattedDate]);

    return (
        <motion.div
            key="step5"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col w-full items-center text-center space-y-6 relative z-10"
        >
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-[#6D597A] mb-2"
            >
                Договорились! 🎉
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#836993] mb-6 font-medium"
            >
                Вот наш чудесный план:
            </motion.p>

            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', bounce: 0.4 }}
                className="w-full p-6 md:p-8 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(255,182,193,0.3)] flex flex-col space-y-6 text-left relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFF0F5] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FFD1DC]/50 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-300">
                    <p className="text-sm text-[#FF91A4] font-bold uppercase tracking-widest mb-1">Чем займемся</p>
                    <p className="text-xl md:text-2xl text-[#6D597A] font-semibold">{displayActivity}</p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFD1DC] to-transparent relative z-10" />

                <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-300">
                    <p className="text-sm text-[#FF91A4] font-bold uppercase tracking-widest mb-1">Где посидим</p>
                    <p className="text-xl md:text-2xl text-[#6D597A] font-semibold">{displayFood}</p>
                    {mapLink && (
                        <a
                            href={mapLink.startsWith('http') ? mapLink : `https://${mapLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-sm text-[#E56B6F] hover:underline font-medium"
                        >
                            📍 Открыть в Яндекс Картах
                        </a>
                    )}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFD1DC] to-transparent relative z-10" />

                <div className="relative z-10 transform transition-transform hover:scale-[1.02] duration-300">
                    <p className="text-sm text-[#FF91A4] font-bold uppercase tracking-widest mb-1">Время</p>
                    <p className="text-xl md:text-2xl text-[#6D597A] font-semibold capitalize">{formattedDate}</p>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="text-[#836993] mt-8 italic text-lg font-medium"
            >
                {isSent ? 'Жду с нетерпением ✨' : 'Сохраняем планы...'}
            </motion.p>
        </motion.div>
    );
};

// --- Основной компонент приложения ---
export default function App() {
    const [step, setStep] = useState(1);
    const [noClicks, setNoClicks] = useState(0);

    // Стейты выбора
    const [activity, setActivity] = useState('');
    const [customActivity, setCustomActivity] = useState('');
    const [showCustomActivity, setShowCustomActivity] = useState(false);

    const [food, setFood] = useState('');
    const [customFood, setCustomFood] = useState('');
    const [mapLink, setMapLink] = useState('');
    const [showCustomFood, setShowCustomFood] = useState(false);

    const [date, setDate] = useState('');

    const pageVariants = {
        initial: { opacity: 0, filter: 'blur(10px)', scale: 0.95 },
        animate: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 0.6, type: 'spring', bounce: 0.3 } },
        exit: { opacity: 0, filter: 'blur(10px)', scale: 0.95, transition: { duration: 0.4 } }
    };

    const handleNoClick = () => {
        setNoClicks(prev => prev + 1);
    };

    const handleYesClick = () => {
        setStep(2);
    };

    const yesScale = 1 + (noClicks * 0.2);
    const noScale = noClicks > 0 ? Math.max(0.3, 1 - noClicks * 0.2) : 1;
    const noOpacity = noClicks > 0 ? Math.max(0.1, 1 - noClicks * 0.2) : 1;

    // --- Шаг 1 ---
    const renderStep1 = () => (
        <motion.div
            key="step1"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center text-center space-y-8 relative z-10"
        >
            <h1 className="text-3xl md:text-4xl font-semibold text-[#6D597A] tracking-tight leading-snug">
                Согласна ли ты встретиться <br className="hidden md:block"/> и провести а-ля свидание?
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full mt-8 h-40">
                <Magnetic>
                    <motion.button
                        animate={{
                            scale: yesScale,
                            boxShadow: ['0px 0px 0px rgba(255, 182, 193, 0)', '0px 0px 20px rgba(255, 182, 193, 0.8)', '0px 0px 0px rgba(255, 182, 193, 0)']
                        }}
                        transition={{
                            scale: { type: "spring", stiffness: 300, damping: 20 },
                            boxShadow: { repeat: Infinity, duration: 2 }
                        }}
                        onClick={handleYesClick}
                        className="px-10 py-4 w-full md:w-auto bg-gradient-to-r from-[#FFB6C1] to-[#FF91A4] text-white font-bold rounded-3xl shadow-[0_0_20px_rgba(255,182,193,0.6)] hover:shadow-[0_0_30px_rgba(255,182,193,0.9)] text-lg transition-colors border border-white/40 cursor-pointer"
                    >
                        Да ✨
                    </motion.button>
                </Magnetic>

                <motion.button
                    animate={{ scale: noScale, opacity: noOpacity }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={handleNoClick}
                    className="px-8 py-4 w-full md:w-auto bg-white/50 text-[#836993] font-medium rounded-3xl border border-white/60 hover:bg-white/80 transition-colors text-lg shadow-sm cursor-pointer"
                >
                    Нет
                </motion.button>
            </div>
        </motion.div>
    );

    // --- Шаг 2 ---
    const renderStep2 = () => {
        const options = [
            { text: 'Кино', emoji: '🍿' },
            { text: 'Прогулка в парке', emoji: '🌳' },
            { text: 'Делать ремонт', emoji: '😂' },
            { text: 'Свой вариант', emoji: '✨' }
        ];

        const containerVariants = {
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
            }
        };

        const itemVariants = {
            hidden: { opacity: 0, scale: 0.5, rotate: -20 },
            show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', bounce: 0.5 } }
        };

        return (
            <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col w-full space-y-8 relative z-10"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-[#6D597A] text-center mb-2">
                    Как проведем время?
                </h2>

                {!showCustomActivity ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {options.map((option) => (
                            <motion.button
                                key={option.text}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    rotate: 2,
                                    boxShadow: '0px 8px 25px rgba(255, 182, 193, 0.6)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (option.text === 'Свой вариант') setShowCustomActivity(true);
                                    else { setActivity(`${option.text} ${option.emoji}`); setStep(3); }
                                }}
                                className="p-5 rounded-2xl bg-white/60 hover:bg-white/90 border border-[#FFD1DC] shadow-sm text-[#6D597A] font-medium transition-colors flex items-center justify-center space-x-3 text-lg backdrop-blur-sm cursor-pointer"
                            >
                                <span>{option.text}</span>
                                <span className="text-2xl">{option.emoji}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Напиши свой идеальный вариант..."
                            value={customActivity}
                            onChange={(e) => setCustomActivity(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-white/70 border-2 border-[#FFD1DC] focus:outline-none focus:border-[#FF91A4] focus:ring-4 focus:ring-[#FFD1DC]/50 text-[#6D597A] shadow-inner transition-all text-lg"
                            autoFocus
                        />
                        <button
                            onClick={() => { if (customActivity) { setActivity(customActivity); setStep(3); } }}
                            disabled={!customActivity.trim()}
                            className="w-full py-4 bg-gradient-to-r from-[#FFB6C1] to-[#FF91A4] hover:from-[#FF91A4] hover:to-[#FF7A93] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all text-lg cursor-pointer"
                        >
                            Далее ✨
                        </button>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    // --- Шаг 3 ---
    const renderStep3 = () => {
        const options = [
            { text: 'Итальянская кухня', emoji: '🍝' },
            { text: 'Японская кухня', emoji: '🍣' },
            { text: 'Грузинская кухня', emoji: '🥟' },
            { text: 'Свой вариант', emoji: '✨' }
        ];

        const containerVariants = {
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
            }
        };

        const itemVariants = {
            hidden: { opacity: 0, rotateX: 90, y: 20 },
            show: { opacity: 1, rotateX: 0, y: 0, transition: { type: 'spring', damping: 12, mass: 0.8 } }
        };

        return (
            <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col w-full space-y-8 relative z-10"
                style={{ perspective: 1000 }}
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-[#6D597A] text-center mb-2">
                    Где посидим?
                </h2>

                {!showCustomFood ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {options.map((option) => (
                            <motion.button
                                key={option.text}
                                variants={itemVariants}
                                whileHover={{
                                    y: -5,
                                    boxShadow: '0px 15px 25px rgba(255, 182, 193, 0.7)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (option.text === 'Свой вариант') setShowCustomFood(true);
                                    else { setFood(`${option.text} ${option.emoji}`); setStep(4); }
                                }}
                                className="p-5 rounded-2xl bg-white/50 border border-[#FFD1DC] shadow-sm text-[#6D597A] font-medium transition-all duration-200 flex items-center justify-center space-x-3 text-lg backdrop-blur-sm cursor-pointer"
                            >
                                <span>{option.text}</span>
                                <span className="text-2xl">{option.emoji}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Какую кухню или заведение предпочитаешь?"
                            value={customFood}
                            onChange={(e) => setCustomFood(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-white/70 border-2 border-[#FFD1DC] focus:outline-none focus:border-[#FF91A4] focus:ring-4 focus:ring-[#FFD1DC]/50 text-[#6D597A] shadow-inner transition-all text-lg"
                            autoFocus
                        />
                        <input
                            type="url"
                            placeholder="Ссылка на Яндекс Карты (необязательно)"
                            value={mapLink}
                            onChange={(e) => setMapLink(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-white/70 border-2 border-[#FFD1DC] focus:outline-none focus:border-[#FF91A4] focus:ring-4 focus:ring-[#FFD1DC]/50 text-[#6D597A] shadow-inner transition-all text-sm md:text-base"
                        />
                        <button
                            onClick={() => { if (customFood) { setFood(customFood); setStep(4); } }}
                            disabled={!customFood.trim()}
                            className="w-full py-4 bg-gradient-to-r from-[#FFB6C1] to-[#FF91A4] hover:from-[#FF91A4] hover:to-[#FF7A93] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all text-lg cursor-pointer"
                        >
                            Далее ✨
                        </button>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    // --- Шаг 4 ---
    const renderStep4 = () => (
        <motion.div
            key="step4"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col w-full space-y-8 relative z-10"
        >
            <h2 className="text-2xl md:text-3xl font-semibold text-[#6D597A] text-center mb-2">
                Когда? 🕰️
            </h2>
            <div className="flex flex-col space-y-8">
                <motion.div
                    animate={{ boxShadow: ['0px 0px 0px rgba(255, 182, 193, 0)', '0px 0px 25px rgba(255, 182, 193, 1)', '0px 0px 0px rgba(255, 182, 193, 0)'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="rounded-2xl"
                >
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-5 rounded-2xl bg-white/80 border-2 border-[#FFD1DC] focus:outline-none focus:border-[#FF91A4] text-[#6D597A] shadow-inner text-lg font-medium cursor-pointer"
                    />
                </motion.div>

                <button
                    onClick={() => setStep(5)}
                    disabled={!date}
                    className="w-full py-4 bg-gradient-to-r from-[#FFB6C1] to-[#FF91A4] hover:from-[#FF91A4] hover:to-[#FF7A93] disabled:opacity-50 disabled:grayscale text-white font-bold rounded-2xl shadow-lg transition-all text-lg cursor-pointer"
                >
                    Подтвердить ⭐
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF0F5] via-[#FFE4E1] to-[#F8C8D6] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {/* Парящие частицы на финальном шаге */}
            {step === 5 && <FloatingDust />}

            {/* Мягкие фоновые декоративные сферы */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="fixed top-[10%] left-[10%] w-[40vw] h-[40vw] bg-[#FFB6C1]/20 rounded-full blur-[100px] pointer-events-none z-0"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="fixed bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-[#FFD1DC]/30 rounded-full blur-[120px] pointer-events-none z-0"
            />

            {/* Главная стеклянная карточка */}
            <motion.div
                layout
                className="bg-white/40 backdrop-blur-xl border border-white/70 rounded-[2.5rem] p-6 md:p-12 shadow-[0_8px_32px_0_rgba(255,182,193,0.2)] w-full max-w-xl min-h-[450px] flex items-center justify-center relative z-10"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && (
                        <Step5
                            activity={activity}
                            customActivity={customActivity}
                            food={food}
                            customFood={customFood}
                            mapLink={mapLink}
                            date={date}
                            pageVariants={pageVariants}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}