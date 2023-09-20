import { Flex, Button, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import "./Header.css";
import BentoMenuIcon from "../../../../assets/bentoMenu.svg";
import { Link } from "react-router-dom";
function Header() {
    return (
        <div className="header">
            <Flex justify={"space-between"} background={"#1D2125"} padding={"0.8rem 0;"} align={"center"}>
                <Flex className="right-bar" align={"center"} gap={"1rem"} marginLeft={"1rem"}>
                    <Link to="/boards">
                        <img src={BentoMenuIcon}></img>
                    </Link>
                    <Link to="/boards">
                        <Text color={"white"} fontSize="1.5rem">
                            <img className="branding" src={"https://trello.com/assets/d947df93bc055849898e.gif"}></img>
                        </Text>
                    </Link>
                </Flex>
                <div className="left-bar"></div>
            </Flex>
        </div>
    );
}

export default Header;
