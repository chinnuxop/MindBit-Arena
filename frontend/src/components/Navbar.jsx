import React, { useState, useRef } from 'react'
import { backgroundDesigns, svgPatterns, navbarAnimations, navbarStyles } from '../assets/dummyStyles';
import { useNavigate } from 'react-router-dom';
// import {Show} from '@clerk/react';
import { SignInButton } from "@clerk/clerk-react";

const Navbar = ({ logoSrc, quizType = "default" }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const navRef = useRef(null);
    const menuBtnRef = useRef(null);
    const menuRef = useRef(null);

    const design = backgroundDesigns[quizType] || backgroundDesigns.default;
    const pattern = svgPatterns[design.pattern] || svgPatterns.abstract;

    const goTo = (path) => {
        navigate(path);
        setMenuOpen(false);
    }


    return (
        <div className={navbarStyles.container}>
            <nav ref={navRef} className={navbarStyles.nav(design.borderColor, isHovering)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
                <div className={navbarStyles.patternContainer}>
                    <div className={navbarStyles.patternLayer}
                        style={{
                            backgroundImage: pattern,
                            ...navbarStyles.backgroundPatternStyle,

                        }} />
                </div>
                <div className={navbarStyles.innerContainer}>
                    <div className={navbarStyles.flexContainer}>
                        <div className={navbarStyles.logoSection}>
                            <button className={navbarStyles.logo} onClick={() => goTo('/')}>
                                <img src={
                                    logoSrc ||
                                    "https://cdn-icons-png.flaticon.com/128/5806/5806364.png"
                                }
                                    alt="logo"
                                    className={navbarStyles.logoImage} />

                            </button>
                        </div>

                        <div className={navbarStyles.titleContainer}>
                            <div className={navbarStyles.titleWrapper}>
                                <div className={navbarStyles.titleBox}>
                                    <h1 className={navbarStyles.titleText(design.textcolor)}>
                                        <span className={navbarStyles.titleGradient}>
                                            MindBit Arena
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className={navbarStyles.desktopButtons}>
                            <Show when="signed-out">
                                <SignInButton mode="modal">
                                    <button className={navbarStyles.buttonBase(design.accentColor)}>
                                        My Result
                                    </button>
                                </SignInButton>
                            </Show>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;