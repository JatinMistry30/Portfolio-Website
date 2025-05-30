import React, { useEffect, useState, useCallback } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Lost and Found System",
      description:
        "Developed for my college to help students report and claim lost/found items on campus. Includes real-time chat system.",
      tags: ["MERN", "Socket.io"],
      color: "bg-orange-100",
    },
    {
      id: 2,
      title: "CodeArena",
      description:
        "1v1 coding battle platform where users pick a language and compete. Winners get promoted through ranks.",
      tags: ["MERN", "Socket.io"],
      color: "bg-red-100",
    },
    {
      id: 3,
      title: "Service Selling Website",
      description:
        "Admin dashboard for service owners to post items. Users can view services and pay using Razorpay.",
      tags: ["MERN", "Razorpay"],
      color: "bg-indigo-100",
    },
    {
      id: 4,
      title: "Portfolio Website – Ashapura Caterers",
      description:
        "Business portfolio website for Ashapura Caterers to showcase their services and brand online.",
      tags: ["MERN"],
      color: "bg-teal-100",
    },
  ];

  // Handle project click
  const handleProjectClick = (id) => {
    setActiveProject(id === activeProject ? null : id);
  };

  // Close project when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeProject && !e.target.closest(".project-tile")) {
        setActiveProject(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeProject]);

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Handle touch events for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || activeProject) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe) {
      setZoomLevel((prev) => Math.min(prev + 0.2, 1.2)); // Changed max to 1.2
    } else if (isDownSwipe) {
      setZoomLevel((prev) => Math.max(prev - 0.2, 0));
    }
  }, [touchStart, touchEnd, activeProject]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = (e) => {
      if (activeProject) return;

      e.preventDefault();
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      const increment = 0.2;

      if (e.deltaY > 0) {
        setZoomLevel((prev) => Math.min(prev + increment, 1.2)); // Changed max to 1.2
      } else {
        setZoomLevel((prev) => Math.max(prev - increment, 0));
      }

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 50);
    };
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setZoomLevel((prev) => Math.min(prev + 0.2, 1.2)); // Changed max to 1.2
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setZoomLevel((prev) => Math.max(prev - 0.2, 0));
      } else if (e.key === "Escape" && activeProject) {
        setActiveProject(null);
      }
    };
    const preventScroll = (e) => {
      if (isMobile) {
        e.preventDefault();
      }
    };

    if (!isMobile) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    }
    window.addEventListener("keydown", handleKeyDown);

    if (isMobile) {
      document.body.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (isMobile) {
        document.body.removeEventListener("touchmove", preventScroll);
        document.body.style.overflow = "auto";
      }
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, activeProject]);

  // Responsive calculations
  const getResponsiveValues = () => {
    if (isMobile) {
      return {
        zoomScale: 1 + zoomLevel * 24,
        zoomTranslateX: zoomLevel * -200,
        zoomTranslateY: zoomLevel * -100,
        mScale: 1 + zoomLevel * 0.6,
        titleSize: "text-4xl sm:text-5xl",
        aboutTitleSize: "text-3xl sm:text-4xl",
        projectsTitleSize: "text-2xl sm:text-3xl",
        padding: "px-4 sm:px-6",
        maxBlur: 2,
      };
    } else if (isTablet) {
      return {
        zoomScale: 1 + zoomLevel * 35,
        zoomTranslateX: zoomLevel * -300,
        zoomTranslateY: zoomLevel * -120,
        mScale: 1 + zoomLevel * 0.7,
        titleSize: "text-5xl md:text-6xl",
        aboutTitleSize: "text-4xl md:text-5xl",
        projectsTitleSize: "text-3xl md:text-4xl",
        padding: "px-6 md:px-12",
        maxBlur: 2.5,
      };
    } else {
      return {
        zoomScale: 1 + zoomLevel * 49,
        zoomTranslateX: zoomLevel * -400,
        zoomTranslateY: zoomLevel * -150,
        mScale: 1 + zoomLevel * 0.8,
        titleSize: "text-6xl md:text-7xl lg:text-8xl",
        aboutTitleSize: "text-5xl md:text-6xl lg:text-7xl",
        projectsTitleSize: "text-4xl md:text-5xl lg:text-6xl",
        padding: "px-8 md:px-16 lg:px-24",
        maxBlur: 3,
      };
    }
  };

  const responsive = getResponsiveValues();

  const heroOpacity = zoomLevel < 0.2 ? 1 : 0;
  const firstParticlesOpacity = zoomLevel >= 0.2 && zoomLevel < 0.4 ? 1 : 0;
  const aboutOpacity = zoomLevel >= 0.4 && zoomLevel < 0.6 ? 1 : 0;
  const secondParticlesOpacity = zoomLevel >= 0.6 && zoomLevel < 0.8 ? 1 : 0;
  const projectsOpacity = zoomLevel >= 0.8 && zoomLevel < 1.0 ? 1 : 0;
  const thirdParticlesOpacity = zoomLevel >= 1.0 && zoomLevel < 1.2 ? 1 : 0; // New range
  const footerOpacity = zoomLevel >= 1.2 ? 1 : 0; // Moved to 1.2

  const mGlow = zoomLevel * (isMobile ? 60 : 120);
  const getCurrentStage = () => {
    if (zoomLevel < 0.2) return 1; // Hero
    if (zoomLevel < 0.4) return 2; // First Particles
    if (zoomLevel < 0.6) return 3; // About
    if (zoomLevel < 0.8) return 4; // Second Particles
    if (zoomLevel < 1.0) return 5; // Projects
    if (zoomLevel < 1.2) return 6; // Third Particles
    return 7; // Footer
  };
  const getStageText = () => {
    const stage = getCurrentStage();
    const instructions = isMobile ? "Swipe up" : "Scroll down";

    switch (stage) {
      case 1:
        return `${instructions} to zoom into M`; // Hero
      case 2:
        return "Experience the particles"; // First Particles
      case 3:
        return `${instructions} to learn about me`; // About
      case 4:
        return "More particles ahead"; // Second Particles
      case 5:
        return "Explore my projects"; // Projects
      case 6:
        return "Final particle burst"; // Third Particles
      case 7:
        return "Connect with me"; // Footer
      default:
        return `${instructions} to continue`;
    }
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-gray-900"
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      {/* Mobile Instruction */}
      {isMobile && zoomLevel === 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
            👆 Swipe up to zoom into M
          </div>
        </div>
      )}

      {/* Floating Particles */}
      {zoomLevel > 0.2 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(isMobile ? 8 : 15)].map((_, i) => (
            <div
              key={i}
              className="zoom-particles"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: Math.min(zoomLevel * 1.5, 0.8),
              }}
            />
          ))}
        </div>
      )}
      {/* First Particle Stage */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: firstParticlesOpacity,
          background:
            "radial-gradient(circle at center, rgba(249, 115, 22, 0.1), rgba(0, 0, 0, 0.9))",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(isMobile ? 20 : 40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: firstParticlesOpacity * (0.3 + Math.random() * 0.7),
              }}
            />
          ))}
        </div>
      </div>

      {/* Second Particle Stage */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: secondParticlesOpacity,
          background:
            "radial-gradient(circle at center, rgba(249, 115, 22, 0.15), rgba(0, 0, 0, 0.95))",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(isMobile ? 25 : 50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-orange-300 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDelay: `${i * 0.15}s`,
                opacity: secondParticlesOpacity * (0.4 + Math.random() * 0.6),
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: thirdParticlesOpacity,
          background:
            "radial-gradient(circle at center, rgba(249, 115, 22, 0.2), rgba(0, 0, 0, 0.98))",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(isMobile ? 30 : 60)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-orange-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                animationDelay: `${i * 0.1}s`,
                opacity: thirdParticlesOpacity * (0.5 + Math.random() * 0.5),
              }}
            />
          ))}
        </div>
      </div>
      {/* Project Overlay */}
      <div className={`project-overlay ${activeProject ? "active" : ""}`} />

      {/* Zoom Container */}
      <div
        className="zoom-container absolute inset-0"
        style={{
          transform: `scale(${responsive.zoomScale}) translate(${responsive.zoomTranslateX}px, ${responsive.zoomTranslateY}px)`,
          filter: `blur(${Math.min(zoomLevel * 1.5, responsive.maxBlur)}px)`,
        }}
      >
        {/* Hero Section */}
        <section
          className={`absolute inset-0 flex flex-col justify-center ${responsive.padding} ultra-smooth no-select`}
          style={{
            opacity: heroOpacity,
            background: `
              radial-gradient(circle at center, rgba(249, 115, 22, ${
                zoomLevel * 0.08
              }), transparent 70%),
              linear-gradient(135deg, #f9f9f9, #e5e5e5)
            `,
            transform: `translateY(${zoomLevel * -20}px) scale(${
              1 - zoomLevel * 0.1
            })`,
          }}
        >
          <div className="max-w-6xl fade-in-up">
            <div
              className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 tracking-wider ultra-smooth"
              style={{
                opacity: Math.max(0, 1 - zoomLevel * 2.5),
                transform: `translateY(${zoomLevel * -10}px)`,
              }}
            >
              2025
            </div>
            <div className="flex items-center">
              <div
                className={`w-px bg-gradient-to-b from-orange-500 to-gray-300 ${
                  isMobile ? "h-20" : "h-32"
                } mr-4 sm:mr-8 ultra-smooth`}
                style={{
                  opacity: Math.max(0, 1 - zoomLevel * 2.5),
                  transform: `scaleY(${1 - zoomLevel * 0.3})`,
                }}
              />
              <div className="relative">
                <div
                  className={`absolute ${
                    isMobile
                      ? "top-8 right-8 text-4xl"
                      : "top-20 right-20 text-9xl"
                  } font-bold text-orange-200 pointer-events-none select-none ultra-smooth opacity-10`} // Changed opacity-10 to opacity-20
                  style={{
                    opacity: Math.max(0, 0.2 - zoomLevel * 0.3), // Changed from 0.1 to 0.2
                    transform: `scale(${1 + zoomLevel * 2}) rotate(${
                      zoomLevel * 20
                    }deg)`,
                    color: "#f97316", // Added orange color directly
                    textShadow: "0 0 20px rgba(249, 115, 22, 0.3)", // Added glow
                  }}
                >
                  P
                </div>
                <h1
                  className={`${responsive.titleSize} font-extrabold text-gray-700 mb-4 sm:mb-8 ultra-smooth`}
                >
                  <span
                    style={{
                      opacity: Math.max(0, 1 - zoomLevel * 2.5),
                      transform: `translateX(${zoomLevel * -30}px)`,
                    }}
                  >
                    Jatin{" "}
                  </span>
                  <span
                    className="morphing-m glow-text"
                    style={{
                      transform: `scale(${responsive.mScale}) translateY(${
                        zoomLevel * -8
                      }px)`,
                      textShadow: `0 0 ${mGlow}px rgba(249, 115, 22, ${Math.min(
                        zoomLevel * 2.5,
                        1
                      )})`,
                      color: zoomLevel > 0.3 ? "#f97316" : "#374151",
                    }}
                  >
                    M
                  </span>
                  <span
                    style={{
                      opacity: Math.max(0, 1 - zoomLevel * 2.5),
                      transform: `translateX(${zoomLevel * 30}px)`,
                    }}
                  >
                    istry
                  </span>
                </h1>
                <h2
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 font-light tracking-wide ultra-smooth"
                  style={{
                    opacity: Math.max(0, 1 - zoomLevel * 3),
                    transform: `translateY(${zoomLevel * 20}px)`,
                  }}
                >
                  Portfolio
                </h2>
                <div
                  className="mt-4 sm:mt-8 text-gray-500 text-xs sm:text-sm ultra-smooth"
                  style={{
                    opacity: Math.max(0, 1 - zoomLevel * 3.5),
                    transform: `translateY(${zoomLevel * 25}px)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span>Full-Stack Developer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About Me Section */}
      <section
        className={`absolute inset-0 flex flex-col justify-center ${responsive.padding} ultra-smooth no-select`}
        style={{
          opacity: aboutOpacity,
          background: `
            radial-gradient(circle at center, rgba(249, 115, 22, ${
              aboutOpacity * 0.04
            }), transparent 70%),
            linear-gradient(135deg, #ffffff, #f8fafc)
          `,
          transform: `scale(${0.85 + aboutOpacity * 0.15}) translate(${
            (1 - aboutOpacity) * 80
          }px, ${(1 - aboutOpacity) * 40}px)`,
          filter: `blur(${Math.max(0, (1 - aboutOpacity) * 2)}px)`,
        }}
      >
        <div className="max-w-6xl w-full">
          <div
            className="text-orange-500 text-xs sm:text-sm mb-1 sm:mb-2 tracking-wider font-semibold ultra-smooth"
            style={{
              opacity: aboutOpacity,
              transform: `translateY(${(1 - aboutOpacity) * 15}px)`,
            }}
          >
            Part 1
          </div>
          <div className="flex">
            <div
              className={`w-px bg-gradient-to-b from-orange-500 to-gray-300 ${
                isMobile ? "h-64" : isTablet ? "h-80" : "h-96"
              } mr-4 sm:mr-8 ultra-smooth`}
              style={{
                opacity: aboutOpacity,
                transform: `scaleY(${aboutOpacity})`,
              }}
            />
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
              <div className="relative">
                <div
                  className={`absolute ${
                    isMobile
                      ? "-top-2 -left-8 text-4xl"
                      : "-top-4 -left-16 text-8xl"
                  } font-bold text-orange-100 pointer-events-none select-none ultra-smooth`}
                  style={{
                    opacity: aboutOpacity * 0.25,
                    transform: `scale(${0.3 + aboutOpacity * 0.7}) rotate(${
                      aboutOpacity * 10
                    }deg) translateY(${(1 - aboutOpacity) * 25}px)`,
                  }}
                >
                  M
                </div>
                <h1
                  className={`${responsive.aboutTitleSize} font-bold text-gray-800 relative z-10 ultra-smooth`}
                  style={{
                    opacity: aboutOpacity,
                    transform: `translateY(${(1 - aboutOpacity) * 30}px)`,
                  }}
                >
                  About{" "}
                  <span
                    className="morphing-m glow-text"
                    style={{
                      textShadow: `0 0 ${
                        aboutOpacity * (isMobile ? 15 : 30)
                      }px rgba(249, 115, 22, 0.6)`,
                      color: aboutOpacity > 0.5 ? "#f97316" : "#1f2937",
                    }}
                  >
                    M
                  </span>
                  e
                </h1>
              </div>

              <p
                className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed ultra-smooth"
                style={{
                  opacity: Math.min(aboutOpacity * 1.3, 1),
                  transform: `translateY(${(1 - aboutOpacity) * 35}px)`,
                }}
              >
                I'm Jatin Mistry, a passionate full-stack developer and recent
                BSc IT graduate. With a deep interest in building clean,
                user-friendly web applications, I enjoy turning ideas into
                reality using modern technologies. I believe in creating digital
                experiences that not only function beautifully but also tell a
                story.
              </p>

              <div
                className={`grid ${
                  isMobile
                    ? "grid-cols-1 gap-4"
                    : "grid-cols-1 sm:grid-cols-3 gap-6"
                } mt-4 sm:mt-6`}
                style={{
                  opacity: Math.min(aboutOpacity * 1.4, 1),
                  transform: `translateY(${(1 - aboutOpacity) * 45}px)`,
                }}
              >
                <div className="group p-4 sm:p-6 border border-gray-200 rounded-xl hover:shadow-2xl hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 bg-white">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <span className="text-orange-500 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                      J
                    </span>
                  </div>
                  <span className="block text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    Name
                  </span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                    Jatin Mistry
                  </span>
                </div>

                <div className="group p-4 sm:p-6 border border-gray-200 rounded-xl hover:shadow-2xl hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 bg-white">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <span className="text-orange-500 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                      🎓
                    </span>
                  </div>
                  <span className="block text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    Education
                  </span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                    BSc IT Graduate
                  </span>
                </div>

                <div className="group p-4 sm:p-6 border border-gray-200 rounded-xl hover:shadow-2xl hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 bg-white">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <span className="text-orange-500 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                      📍
                    </span>
                  </div>
                  <span className="block text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    Location
                  </span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                    Thane
                  </span>
                </div>
              </div>

              <div
                className="mt-4 sm:mt-8 flex flex-wrap gap-2 sm:gap-3"
                style={{
                  opacity: Math.min(aboutOpacity * 1.5, 1),
                  transform: `translateY(${(1 - aboutOpacity) * 55}px)`,
                }}
              >
                {[
                  "React",
                  "Node.js",
                  "Full-Stack",
                  "Web Development",
                  "UI/UX",
                ].map((skill, index) => (
                  <span
                    key={skill}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-orange-50 text-orange-700 rounded-full text-xs sm:text-sm font-medium hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-default ultra-smooth"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      opacity: Math.min(aboutOpacity * 1.6, 1),
                      transform: `translateY(${
                        (1 - aboutOpacity) * (10 + index * 5)
                      }px)`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
  className={`absolute inset-0 flex flex-col justify-center ${responsive.padding} ultra-smooth no-select`}
  style={{
    opacity: projectsOpacity,
    background: `
      radial-gradient(circle at center, rgba(249, 115, 22, ${
        projectsOpacity * 0.03
      }), transparent 70%),
      linear-gradient(135deg, #ffffff, #f8fafc)
    `,
    transform: `scale(${0.85 + projectsOpacity * 0.15}) translate(${
      (1 - projectsOpacity) * 100
    }px, ${(1 - projectsOpacity) * 50}px)`,
    filter: `blur(${Math.max(0, (1 - projectsOpacity) * 2)}px)`,
    pointerEvents: projectsOpacity > 0 ? 'auto' : 'none', // Add this line
  }}
>
        <div className="max-w-6xl w-full">
          <div
            className="text-orange-500 text-xs sm:text-sm mb-1 sm:mb-2 tracking-wider font-semibold ultra-smooth"
            style={{
              opacity: projectsOpacity,
              transform: `translateY(${(1 - projectsOpacity) * 15}px)`,
            }}
          >
            Part 2
          </div>
          <div className="flex">
            <div
              className={`w-px bg-gradient-to-b from-orange-500 to-gray-300 ${
                isMobile ? "h-64" : isTablet ? "h-80" : "h-96"
              } mr-4 sm:mr-8 ultra-smooth`}
              style={{
                opacity: projectsOpacity,
                transform: `scaleY(${projectsOpacity})`,
              }}
            />
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full">
              <div className="relative">
                <div
                  className={`absolute ${
                    isMobile
                      ? "-top-2 -left-8 text-4xl"
                      : "-top-4 -left-16 text-8xl"
                  } font-bold text-orange-100 pointer-events-none select-none ultra-smooth`}
                  style={{
                    opacity: projectsOpacity * 0.25,
                    transform: `scale(${0.3 + projectsOpacity * 0.7}) rotate(${
                      projectsOpacity * 10
                    }deg) translateY(${(1 - projectsOpacity) * 25}px)`,
                  }}
                >
                  P
                </div>
                <h1
                  className={`${responsive.projectsTitleSize} font-bold text-gray-800 relative z-10 ultra-smooth`}
                  style={{
                    opacity: projectsOpacity,
                    transform: `translateY(${(1 - projectsOpacity) * 30}px)`,
                  }}
                >
                  My{" "}
                  <span
                    className="morphing-m glow-text"
                    style={{
                      textShadow: `0 0 ${
                        projectsOpacity * (isMobile ? 15 : 30)
                      }px rgba(249, 115, 22, 0.6)`,
                      color: projectsOpacity > 0.5 ? "#f97316" : "#1f2937",
                    }}
                  >
                    P
                  </span>
                  rojects
                </h1>
              </div>

              <div
                className={`grid ${
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                } gap-4 sm:gap-6 mt-4 sm:mt-6`}
                style={{
                  opacity: Math.min(projectsOpacity * 1.3, 1),
                  transform: `translateY(${(1 - projectsOpacity) * 35}px)`,
                }}
              >
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`project-tile ${
                      activeProject === project.id ? "active" : ""
                    } ${project.color} p-6 rounded-xl cursor-pointer`}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white bg-opacity-70 rounded-full text-xs sm:text-sm text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {activeProject === project.id && (
                      <div className="mt-4">
                        <p className="text-sm sm:text-base text-gray-700">
                          This is more detailed information about the{" "}
                          {project.title} project. You can add more content here
                          like features, technologies used, challenges faced,
                          and solutions implemented.
                        </p>
                        <button
                          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProject(null);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
{footerOpacity > 0 && (
  <section 
    className={`absolute inset-0 flex flex-col justify-center ${responsive.padding} ultra-smooth no-select`}
    style={{ 
      opacity: footerOpacity,
      background: `
        radial-gradient(circle at center, rgba(249, 115, 22, ${footerOpacity * 0.05}), transparent 70%),
        linear-gradient(135deg, #111827, #1f2937)
      `,
      transform: `scale(${0.85 + footerOpacity * 0.15}) translate(${(1 - footerOpacity) * 120}px, ${(1 - footerOpacity) * 60}px)`,
      filter: `blur(${Math.max(0, (1 - footerOpacity) * 2)}px)`,
    }}
  >
        <div className="max-w-6xl w-full">
          <div
            className="text-orange-500 text-xs sm:text-sm mb-1 sm:mb-2 tracking-wider font-semibold ultra-smooth"
            style={{
              opacity: footerOpacity,
              transform: `translateY(${(1 - footerOpacity) * 15}px)`,
            }}
          >
            Connect
          </div>
          <div className="flex">
            <div
              className={`w-px bg-gradient-to-b from-orange-500 to-gray-300 ${
                isMobile ? "h-48" : isTablet ? "h-64" : "h-80"
              } mr-4 sm:mr-8 ultra-smooth`}
              style={{
                opacity: footerOpacity,
                transform: `scaleY(${footerOpacity})`,
              }}
            />
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full">
              <div className="relative">
                <div
                  className={`absolute ${
                    isMobile
                      ? "-top-2 -left-8 text-4xl"
                      : "-top-4 -left-16 text-8xl"
                  } font-bold text-orange-100 pointer-events-none select-none ultra-smooth`}
                  style={{
                    opacity: footerOpacity * 0.25,
                    transform: `scale(${0.3 + footerOpacity * 0.7}) rotate(${
                      footerOpacity * 10
                    }deg) translateY(${(1 - footerOpacity) * 25}px)`,
                  }}
                >
                  C
                </div>
                <h1
                  className={`${responsive.projectsTitleSize} font-bold text-white relative z-10 ultra-smooth`}
                  style={{
                    opacity: footerOpacity,
                    transform: `translateY(${(1 - footerOpacity) * 30}px)`,
                  }}
                >
                  <span
                    className="morphing-m glow-text"
                    style={{
                      textShadow: `0 0 ${
                        footerOpacity * (isMobile ? 15 : 30)
                      }px rgba(249, 115, 22, 0.6)`,
                      color: footerOpacity > 0.5 ? "#f97316" : "#ffffff",
                    }}
                  >
                    C
                  </span>
                  onnect With Me
                </h1>
              </div>

              <p
                className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed ultra-smooth"
                style={{
                  opacity: Math.min(footerOpacity * 1.3, 1),
                  transform: `translateY(${(1 - footerOpacity) * 35}px)`,
                }}
              >
                Let's collaborate and create something amazing together. Feel
                free to reach out through any of these platforms.
              </p>

              <div
                className={`grid ${
                  isMobile ? "grid-cols-2 gap-4" : "grid-cols-4 gap-6"
                } mt-4 sm:mt-6`}
                style={{
                  opacity: Math.min(footerOpacity * 1.4, 1),
                  transform: `translateY(${(1 - footerOpacity) * 45}px)`,
                }}
              >
                <a
                  href="https://github.com/JatinMistry30"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 sm:p-6 border border-gray-600 rounded-xl hover:shadow-2xl hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <span className="text-orange-500 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                      📁
                    </span>
                  </div>
                  <span className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Code
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    GitHub
                  </span>
                </a>

                <a
                  href="https://www.linkedin.com/in/jatin-mistry-9975p/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 sm:p-6 border border-gray-600 rounded-xl hover:shadow-2xl hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <span className="text-orange-500 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                      💼
                    </span>
                  </div>
                  <span className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Professional
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    LinkedIn
                  </span>
                </a>

                <a
                  href="mailto:jatinmistry9975@gmail.com"
                  className="group p-4 sm:p-6 border border-gray-600 rounded-xl hover:shadow-2xl hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <span className="text-orange-500 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                      📧
                    </span>
                  </div>
                  <span className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Email
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    Gmail
                  </span>
                </a>

                <a
                  href="tel:+918177804106"
                  className="group p-4 sm:p-6 border border-gray-600 rounded-xl hover:shadow-2xl hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 bg-gray-800 hover:bg-gray-700"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <span className="text-orange-500 group-hover:text-white font-bold text-base sm:text-lg transition-colors duration-300">
                      📱
                    </span>
                  </div>
                  <span className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Call
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
              )}
      {/* Progress Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-50">
        <div
          className={`w-1 ${
            isMobile ? "h-12" : "h-20"
          } bg-gray-200 rounded-full overflow-hidden`}
        >
          <div
            className="bg-orange-500 w-full transition-all duration-300 ease-out"
            style={{ height: `${(zoomLevel / 1.2) * 100}%` }} // Changed from zoomLevel * 100 to (zoomLevel / 1.2) * 100
          />
        </div>
        <span className="text-xs text-gray-500 ultra-smooth text-center px-2">
          {getStageText()}
        </span>
      </div>
    </div>

  );
};

export default LandingPage;
