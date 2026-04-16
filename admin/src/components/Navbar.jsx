
import React, { useState, useEffect, useRef  } from 'react'
import { navbarStyles } from '../assets/dummyStyles';
import { useNavigate} from "react-router-dom";
import { useUser, useAuth, Show, SignInButton, UserButton } from "@clerk/react";
import { List, Home, User, X, Menu } from 'lucide-react';

const Navbar = ({
    logoSrc = null,
    siteName = "MindBit Arena",
    rightContent = null,
    onNavigate = null

}) => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const { isSignedIn } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    //to collapse the modal on escape key
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    //close when resizing to md+ and lock scroll for mobile view
    useEffect(() => {
        const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
        window.addEventListener("resize", onResize);
        const prevOverflow = document.body.style.overflow;
        if (mobileOpen) document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("resize", onResize);
            document.body.style.overflow = prevOverflow || "";
        };
    }, [mobileOpen]);


    const handleNavigate = (href) => {
        setMobileOpen(false);
        if (onNavigate) return onNavigate(href);
        try {
            navigate(href);
        }
        catch (error) {
            window.location.href = href;
        }
    }
    //to save token
    const prevSignedInRef = useRef(isSignedIn);

    useEffect(() => {
        let mounted = true;
        async function saveTokenAndMaybeRedirect() {
            if (!isSignedIn || prevSignedInRef.current === isSignedIn) return;
            try {
                const token = await getToken();
                if (token && mounted) {
                    localStorage.setItem("clerkToken", token);
                    console.log("Clerk Token Saved");
                }

            }
            catch (err) {
                console.error("Failed to get Clerk Token:", err);
            }

            const path = window.location.pathname;
            const shouldRedirect =
                path === "/" || path === "/login" || path === "/signin" || path === "";

            if (shouldRedirect) {
                if (onNavigate) onNavigate("/dashboard");
            
            else {
                try {
                    navigate("/dashboard");
                }
                catch {
                    window.location.href = '/dashboard';


                }

            }
        }
        prevSignedInRef.current = isSignedIn;
    }
    saveTokenAndMaybeRedirect();
    return () => {
        mounted = false;
    }
    },[isSignedIn,getToken,navigate,onNavigate]);
    return (
        <nav className={navbarStyles.nav}>
            <div className={navbarStyles.container}>
                <div className={navbarStyles.innerContainer}>
                    <div className={navbarStyles.homeButton}>
                        <button type='button' onClick={() => handleNavigate("/dashboard")} className={navbarStyles.homeButton}>
                            <div className={navbarStyles.logoWrapper}>
                                <img src={
                                    logoSrc ||
                                    "https://cdn-icons-png.flaticon.com/128/5806/5806364.png"
                                }
                                    alt={`${siteName} logo`}
                                    className={navbarStyles.logoImg}
                                />
                            </div>
                            <div className={navbarStyles.siteNameWrapper}>
                                <span className={navbarStyles.siteName}>{siteName}</span>
                                <span className={navbarStyles.siteSubtitle}>
                                    Enter the Arena of Intelligence
                                </span>
                            </div>
                        </button>
                    </div>

                    <Show when="signed-in">
                        <div className={navbarStyles.desktopCenterContainer}>
                            <div className={navbarStyles.desktopCenterInner}>
                                <button onClick={() => handleNavigate("/dashboard")} className={navbarStyles.dashboardButton}>
                                    <Home className={navbarStyles.dashboardIcon} />
                                    <span className={navbarStyles.dashboardText}>Dashboard</span>
                                </button>

                                <button onClick={() => handleNavigate("/list")} className={navbarStyles.listButton}>
                                    <List className={navbarStyles.listIcon} />
                                    <span className={navbarStyles.listText}>List Quiz</span>
                                </button>
                            </div>
                        </div>
                    </Show>

                    <div className="flex items-center gap-3">
                        <div className={navbarStyles.desktopRightContent}>
                            {rightContent ? (
                                rightContent
                            ) : (
                                <div className={navbarStyles.profileGroup}>
                                    <Show when="signed-out">
                                        <SignInButton mode="modal">
                                            <button type="button" className={navbarStyles.profileButton}>
                                                <User className={navbarStyles.profileIcon} />
                                                <span>My Profile</span>
                                            </button>
                                        </SignInButton>
                                    </Show>

                                    <Show when="signed-in">
                                        <div className={navbarStyles.profileGroup}>
                                            <div className={navbarStyles.profileBlur} />
                                            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
                                        </div>
                                    </Show>
                                </div>
                            )}
                        </div>
                        <div className={navbarStyles.mobileMenuContainer}>
                            <button type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMobileOpen((s) => !s);
                                }} className={navbarStyles.hamburgerButton}>

                                {mobileOpen ? (
                                    <X className={navbarStyles.xIcon} />
                                ) : (
                                    <Menu className={navbarStyles.menuIcon} />
                                )}

                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {mobileOpen && (
                <div id="mobile-menu" className={navbarStyles.mobileOverlay}>
                    <div onClick={() => setMobileOpen(false)}
                        className={navbarStyles.mobileBackdrop} />
                    <div className={navbarStyles.mobilePanel}
                        onClick={(e) => e.stopPropagation()}>
                        <nav className={navbarStyles.mobileNav}>
                            <Show when="signed-in">
                                <button onClick={() => handleNavigate("/dashboard")} className={navbarStyles.mobileNavButton}>
                                    <Home className={navbarStyles.mobileNavIcon} />
                                    <div>
                                        <div className={navbarStyles.mobileNavItemTitle}>
                                            Dashboard
                                        </div>
                                    </div>
                                </button>
                                <button onClick={() => handleNavigate("/list")}
                                    className={navbarStyles.mobileNavButton}>
                                    <List className={navbarStyles.mobileNavIcon} />
                                    <div>
                                        <div className={navbarStyles.mobileNavItemTitle}>List Quiz</div>
                                    </div>
                                </button>
                            </Show>

                            <Show when="signed-out">
                                <SignInButton mode="modal">
                                    <button className={navbarStyles.mobileNavButton}>
                                        <User className={navbarStyles.mobileNavIcon} />
                                        <div>
                                            <div className={navbarStyles.mobileNavItemTitle}>
                                                Login
                                            </div>
                                        </div>
                                    </button>

                                </SignInButton>
                            </Show>

                            <Show when="signed-in">
                                <div className={navbarStyles.mobileNavButton}>
                                    <UserButton />
                                </div>
                            </Show>

                        </nav>
                    </div>

                </div>
            )}
        </nav>
    )
}

export default Navbar