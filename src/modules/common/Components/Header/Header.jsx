import { Flex, Button, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import "./Header.css";
import { Link } from "react-router-dom";
function Header() {
    return (
        <div className="header">
            <Flex justify={"space-around"} background={"#005FB1"} padding={"0.8rem 0;"}>
                <Link to="/boards">
                    <Button>Home</Button>
                </Link>
                <Link to="/boards">
                    <Text color={"white"} fontSize="1.5rem">
                        Trello
                    </Text>
                </Link>
                <div className="left-bar"></div>
            </Flex>
        </div>
    );
}

export default Header;
