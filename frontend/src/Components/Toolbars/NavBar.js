import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../ThemeContext';

const NavBar = (props) => {
    
    const context = useContext(ThemeContext)
    const hohol = context.isHohol

    const whereabouts = useLocation().pathname
    const style = () => {
        return {
           "textDecoration": "underline",
           "textUnderlineOffset": "5px",
           "textDecorationColor": "#F3D223",


        }
    }

    
    const linkNamesMap = {
        "/admin":"Admin",
        "/price_compare":"Price",
        "/":"Quantity",
    }
    return(
        <Navbar 
            style={{
                "borderRadius":"0 0 10px 10px",
                "backgroundColor":"#FBEA58",
                "boxShadow": "0px 4px 5px rgba(0, 0, 0, 0.25)",
            }} 
            sticky='top' 
        >
                <div
                    className='mx-5'
                    style={{
                        fontSize:"larger",
                        fontWeight:"bolder"
                    }}
                >
                    ШТАБЕЛЬ
                    {/* {String(hohol)} */}
                </div>
                <Nav
                    style={{
                        "marginLeft":"auto",
                        "color":"black"
                    }}
                >
                    {Object.entries(linkNamesMap).map(([link, name]) =>
                        <Nav.Link 
                            style={whereabouts === link ? style():{}} 
                            className='mx-5' 
                            active={whereabouts === link} 
                            href={link}
                            key={name}
                        >
                            {name}
                        </Nav.Link>
                    )}
                </Nav>
        </Navbar>
    )
}
export default NavBar