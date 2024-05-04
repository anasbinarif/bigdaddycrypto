import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const LayoutWrapper = ({ children }) => {
    return (
        <>
            {/*{!hideNavbarAndFooter.includes(pathname) && <Navbar />}*/}
            <Navbar />
            {children}
            <Footer />
            {/*{!hideNavbarAndFooter.includes(pathname) && <Footer />}*/}
        </>
    );
};

export default LayoutWrapper;
