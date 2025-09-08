import Header from "../../components/Header/Header.client";
import UnderConstructionPage from "../../components/UnderConstructionPage/UnderConstructionPage.client";
import Footer from "../../components/Footer/Footer.server";

const BonusesPage = () => {
  return (
    <>
      <Header logoAlt="Wolfix Logo" /> 
      <UnderConstructionPage 
        title="Сторінка бонусів у розробці!" 
        message="Ми активно працюємо над впровадженням системи бонусів, щоб зробити ваші покупки ще приємнішими. Залишайтеся на зв'язку!"
        buttonText="На головну"
      />
      <Footer /> 
    </>
  );
};

export default BonusesPage;