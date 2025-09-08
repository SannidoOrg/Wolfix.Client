"use client";

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from "../Header/Header.client";
import Footer from "../Footer/Footer.server";

interface UnderConstructionPageProps {
  title?: string;
  message?: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
  buttonText?: string;
  buttonHref?: string;
}

const UnderConstructionPage: FC<UnderConstructionPageProps> = ({
  title = "Отакої!",
  message = "На жаль, ця сторінка тимчасово недоступна. Команда Wolfix працює над її вдосконаленням. Ми робимо все можливе, аби якнайшвидше відкрити її для відвідувачів.",
  illustrationSrc = "/icons/Group845.png",
  illustrationAlt = "Сторінка в розробці",
  buttonText = "Перейти на головну сторінку",
  buttonHref = "/",
}) => {
  return (
    <>
      <Header logoAlt="Wolfix Logo" />
      <div className="under-construction-container">
        <h1 className="under-construction-title">{title}</h1>
        <div className="under-construction-illustration">
          <Image 
            src={illustrationSrc} 
            alt={illustrationAlt} 
            width={200}
            height={200}
            priority 
          />
        </div>
        <p className="under-construction-message">{message}</p>
        
        <Link href={buttonHref} className="under-construction-button">
            {buttonText} <span className="arrow-icon">→</span>
        </Link>

      </div>
      <Footer />
    </>
  );
};

export default UnderConstructionPage;