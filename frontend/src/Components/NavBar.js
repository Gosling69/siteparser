import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavBar = (props) => {
    return(
        <Navbar  sticky='top' bg="dark" variant="dark">
            {/* <Container> */}
                {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
                <Nav className="mx-4">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/admin">Admin</Nav.Link>
                    <Nav.Link href="/price_compare">Price</Nav.Link>
                    <Nav.Link href="/quantity_compare">Quantity</Nav.Link>
                </Nav>
            {/* </Container> */}
        </Navbar>
    )

}
export default NavBar