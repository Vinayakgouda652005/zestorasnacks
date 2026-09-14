import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  FlaskConical,
  Box,
  Heart
} from 'lucide-react';


const HERO_SLIDES = [
  {
    fruit: 'Alphonso Mango',
    slug: 'dried-mango',
    image: '/assets/products/hero-dried-mango.jpg',
  },
  {
    fruit: 'Queen Pineapple',
    slug: 'dried-pineapple',
    image: '/assets/products/hero-dried-pineapple.jpg',
  },
  {
    fruit: 'Pink Guava',
    slug: 'dried-guava',
    image: '/assets/products/hero-dried-guava.jpg',
  },
  {
    fruit: 'Nendran Banana',
    slug: 'dried-banana',
    image: '/assets/products/hero-dried-banana.jpg',
  }
];

// Slide animation variants for continuous horizontal swipe/swap (right to left)
const heroSlideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 1,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 1,
  }),
};

export const HomePage = () => {
  const { products, navigateTo } = useShop();
  const [[activeSlide, direction], setSlide] = useState([0, 1]);
  const touchStartX = useRef(null);

  const paginate = useCallback((newDirection) => {
    setSlide(([curr]) => {
      const next = (curr + newDirection + HERO_SLIDES.length) % HERO_SLIDES.length;
      return [next, newDirection];
    });
  }, []);

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  const goToSlide = (targetIdx) => {
    setSlide(([curr]) => {
      if (targetIdx === curr) return [curr, 1];
      return [targetIdx, targetIdx > curr ? 1 : -1];
    });
  };

  // Automatic carousel slide change every 3 seconds with right-to-left sliding effect
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [paginate]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      // Swiped left -> move right-to-left
      nextSlide();
    } else if (diff < -45) {
      // Swiped right -> move left-to-right
      prevSlide();
    }
    touchStartX.current = null;
  };

  // 4 primary single fruits for the collection display
  const primaryProducts = products.filter(
    (p) => ['dried-mango', 'dried-pineapple', 'dried-guava', 'dried-banana'].includes(p.slug)
  );

  return (
    <div className="bg-[#FAF7F2] text-[#193826]">
      
      {/* ==================================================
          1. HERO SECTION (Auto change with right-to-left swap)
          ================================================== */}
      <section
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center bg-[#182B1F]"
      >
        {/* Background slide images with right-to-left swap motion */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeSlide}
            custom={direction}
            variants={heroSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.75 },
            }}
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
          >
            <img
              src={HERO_SLIDES[activeSlide].image}
              alt={`Zestora ${HERO_SLIDES[activeSlide].fruit}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center pointer-events-none"
            />
            {/* Atmospheric vignette to ensure readable editorial typography while highlighting the right-side pouch & fruit */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#112117]/85 via-[#112117]/45 to-transparent sm:bg-gradient-to-r sm:from-[#112117]/85 sm:via-[#112117]/45 sm:to-transparent sm:w-2/3 lg:w-3/5" />
          </motion.div>
        </AnimatePresence>

        {/* Playful cursive handwriting text matching screenshot right side */}
        <div className="hidden lg:flex absolute right-16 xl:right-28 top-16 z-20 flex-col items-center pointer-events-none select-none">
          <span className="font-script text-3xl sm:text-4xl text-white/95 drop-shadow-md leading-tight transform rotate-[-7deg] tracking-wide">
            Goodness<br />Looks So<br />Good! ♡
          </span>
        </div>

        {/* Hero Left Content Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative z-10 pointer-events-auto">
          <div className="max-w-xl space-y-5 text-left">
            
            {/* Small uppercase eyebrow */}
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#E8D4B0] font-medium block">
              REAL FRUITS. BRIGHTER DAYS.
            </span>

            {/* Large editorial serif headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#FFFFFF] leading-[1.05] tracking-tight">
              Snack<br />
              Better.<br />
              Live Brighter.
            </h1>

            {/* Supporting text */}
            <p className="text-sm sm:text-base text-[#FFFFFF]/85 font-normal leading-relaxed max-w-md">
              Wholesome, naturally dried fruit snacks made for a healthier, happier you.
            </p>

            {/* Two Action Buttons matching screenshot (pill rounded-full) */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                id="hero-shop-now-btn"
                type="button"
                onClick={() => navigateTo('shop')}
                className="px-6 sm:px-7 py-3 bg-[#193826] text-[#FFFFFF] text-xs font-semibold hover:bg-[#12291C] transition-colors rounded-full flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="hero-explore-story-btn"
                type="button"
                onClick={() => navigateTo('story')}
                className="px-6 sm:px-7 py-3 bg-transparent border border-white/80 text-[#FFFFFF] text-xs font-semibold hover:bg-white/15 transition-colors rounded-full inline-flex items-center cursor-pointer"
              >
                <span>Explore Our Story</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Left Navigation Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Right Navigation Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 4 Small Carousel Dots near bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.slug}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 cursor-pointer ${
                activeSlide === idx
                  ? 'w-6 sm:w-7 h-2 rounded-full bg-white shadow-xs'
                  : 'w-2 h-2 rounded-full bg-transparent border border-white/80 hover:bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}: ${slide.fruit}`}
            />
          ))}
        </div>
      </section>

      {/* ==================================================
          2. BENEFITS STRIP (Exact circular icons from reference screenshot)
          ================================================== */}
      <section className="bg-[#FAF7F2] py-8 sm:py-9">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            
            {/* 100% Natural */}
            <div className="flex flex-col items-center space-y-2.5">
              <div className="w-11 h-11 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                <Leaf className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#193826]">
                100% Natural
              </span>
            </div>

            {/* No Artificial Colors */}
            <div className="flex flex-col items-center space-y-2.5">
              <div className="w-11 h-11 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                <FlaskConical className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#193826]">
                No Artificial Colors
              </span>
            </div>

            {/* No Added Preservatives */}
            <div className="flex flex-col items-center space-y-2.5">
              <div className="w-11 h-11 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                <Box className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#193826]">
                No Added Preservatives
              </span>
            </div>

            {/* Wholesome Snacking */}
            <div className="flex flex-col items-center space-y-2.5">
              <div className="w-11 h-11 rounded-full border border-[#193826] bg-[#FAF7F2] flex items-center justify-center text-[#193826]">
                <Heart className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#193826]">
                Wholesome Snacking
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          3. SHOP OUR COLLECTION (Exact layout to reference screenshot)
          ================================================== */}
      <section className="py-12 sm:py-14 bg-[#FAF7F2] border-b border-[#E8DDCD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#193826]">
                Shop Our Collection
              </h2>
              <p className="text-xs sm:text-sm text-[#193826]/70 mt-1">
                Real fruits. Real nutrition. Real taste.
              </p>
            </div>

            <button
              id="view-all-products-btn"
              onClick={() => navigateTo('shop')}
              className="text-xs font-semibold text-[#193826] hover:text-[#255038] flex items-center gap-1 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Product Cards in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {primaryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          4. A HEALTHIER TOMORROW, TODAY (Exact 3-part layout from reference screenshot)
          ================================================== */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E8DDCD] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Col: Headline, Body, Pill Button (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#193826] leading-[1.1]">
                A Healthier<br />
                Tomorrow, Today.
              </h2>

              <p className="text-xs sm:text-sm text-[#193826]/80 leading-relaxed max-w-md font-sans">
                At Zestora, we believe snacking should be simple, wholesome, and good for the planet. Our naturally dried fruits bring you real taste, real nutrition, and a brighter tomorrow.
              </p>

              <div>
                <button
                  id="story-our-story-btn"
                  onClick={() => navigateTo('story')}
                  className="px-6 py-3 bg-[#193826] text-[#FFFFFF] text-xs font-semibold hover:bg-[#12291C] transition-colors rounded-full inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Our Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle Col: 3 Clean Stacked Stats (3 cols) */}
            <div className="md:col-span-3 flex flex-col justify-center space-y-7 md:border-l md:border-[#E8DDCD]/80 md:pl-8">
              <div>
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#193826] block leading-none">
                  100%
                </span>
                <span className="text-xs text-[#193826]/75 mt-1.5 block font-sans">
                  Natural Ingredients
                </span>
              </div>

              <div>
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#193826] block leading-none">
                  0
                </span>
                <span className="text-xs text-[#193826]/75 mt-1.5 block font-sans">
                  Artificial Additives
                </span>
              </div>

              <div>
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#193826] block leading-none">
                  1000+
                </span>
                <span className="text-xs text-[#193826]/75 mt-1.5 block font-sans">
                  Happy Customers
                </span>
              </div>
            </div>

            {/* Right Col: Lifestyle Circular Photo with "Good Snacks Happier You ♡" sticker (4 cols) */}
            <div className="md:col-span-4 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#EFE9DF]">
                <img
                  src="/assets/lifestyle-woman.jpg"
                  alt="A Healthier Tomorrow, Today"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Whimsical organic sticker badge matching screenshot */}
              <div className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs py-3 px-4 rounded-[45%_55%_60%_40%/50%_60%_40%_50%] shadow-md border border-[#E8DDCD] text-center rotate-[6deg] select-none">
                <span className="font-script text-xl sm:text-2xl text-[#193826] block leading-tight font-bold">
                  Good<br />
                  Snacks<br />
                  Happier<br />
                  You ♡
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          5. PROCESS SECTION (Dark Forest Green Background matching screenshot)
          ================================================== */}
      <section className="py-16 sm:py-20 bg-[#183424] text-[#FFFFFF] border-b border-[#12291C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left side: Heading, copy, button */}
            <div className="lg:col-span-4 space-y-5">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFFFF] leading-tight">
                From Nature<br />
                to Your Hands
              </h2>

              <p className="text-xs sm:text-sm text-[#FFFFFF]/80 leading-relaxed font-sans">
                We source the finest fruits, carefully dry them to lock in natural goodness, and pack them with love — so you can enjoy nature's best, anytime, anywhere.
              </p>

              <div>
                <button
                  id="process-our-process-btn"
                  onClick={() => navigateTo('why-zestora')}
                  className="px-6 py-2.5 bg-transparent border border-white/80 text-[#FFFFFF] text-xs font-semibold hover:bg-white/10 transition-colors rounded-full inline-flex items-center gap-2"
                >
                  <span>Our Process</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right side: 4 horizontal circular stages connected by arrows */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
              
              {/* Stage 1: Thoughtfully Sourced */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80"
                    alt="Thoughtfully Sourced"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white text-[#183424] flex items-center justify-center shadow-xs">
                    <Leaf className="w-2.5 h-2.5 fill-[#183424] text-[#183424]" />
                  </div>
                </div>
                <span className="text-xs font-medium text-white mt-3 text-center font-sans">
                  Thoughtfully<br />Sourced
                </span>
              </div>

              {/* Arrow 1 */}
              <span className="text-white/60 text-lg hidden sm:inline">→</span>

              {/* Stage 2: Naturally Dried */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=300&q=80"
                    alt="Naturally Dried"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white text-[#183424] flex items-center justify-center shadow-xs">
                    <Leaf className="w-2.5 h-2.5 fill-[#183424] text-[#183424]" />
                  </div>
                </div>
                <span className="text-xs font-medium text-white mt-3 text-center font-sans">
                  Naturally<br />Dried
                </span>
              </div>

              {/* Arrow 2 */}
              <span className="text-white/60 text-lg hidden sm:inline">→</span>

              {/* Stage 3: Packed with Care */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=300&q=80"
                    alt="Packed with Care"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white text-[#183424] flex items-center justify-center shadow-xs">
                    <Leaf className="w-2.5 h-2.5 fill-[#183424] text-[#183424]" />
                  </div>
                </div>
                <span className="text-xs font-medium text-white mt-3 text-center font-sans">
                  Packed<br />with Care
                </span>
              </div>

              {/* Arrow 3 */}
              <span className="text-white/60 text-lg hidden sm:inline">→</span>

              {/* Stage 4: Straight to You */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                  <img
                    src="/assets/hands-holding-pouch.jpg"
                    alt="Straight to You"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white text-[#183424] flex items-center justify-center shadow-xs">
                    <Leaf className="w-2.5 h-2.5 fill-[#183424] text-[#183424]" />
                  </div>
                </div>
                <span className="text-xs font-medium text-white mt-3 text-center font-sans">
                  Straight<br />to You
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          6. FINAL PROMOTIONAL BANNER (Exact match to reference screenshot)
          ================================================== */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-[#1B2F21]">
        {/* Full-width photography of dehydrated pineapple fruit wheels */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=1600&q=80"
            alt="Dried Fruit Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#112117] via-[#112117]/85 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-lg space-y-4 text-left">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
              A Brighter You<br />
              Is Just a Click Away.
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
              Explore our range of naturally delicious fruit snacks.
            </p>

            <div className="pt-2">
              <button
                id="promo-shop-now-btn"
                onClick={() => navigateTo('shop')}
                className="px-6 sm:px-7 py-3 bg-white text-[#193826] text-xs font-semibold rounded-full hover:bg-white/90 transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NOTE: Strictly NO "Loved by Many" reviews section on the homepage as mandated by user instructions and reference screenshot */}
    </div>
  );
};
