import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import FilterPanel from '../FilterPanel/FilterPanel';
import { useState } from 'react';


const NavBar = ({categories}) => {
    
    // const hohol = context.isHohol
    const [showFilter, setShowFilter] = useState(false)
    // const [categories, setCategories] = useState([])
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
                    <Button onClick={() => setShowFilter(true)}>Filter</Button>
                    <FilterPanel show={showFilter} handleClose={() => setShowFilter(false)} categories={categories}/>
                </Nav>
        </Navbar>
    )
}
export default NavBar
NavBar.defaultProps = {
    showFilter: () => console.log("SHOW")
}