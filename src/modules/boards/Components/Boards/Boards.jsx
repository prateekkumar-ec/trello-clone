import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow, PopoverCloseButton, PopoverAnchor } from "@chakra-ui/react";
import axios from "axios";
import Board from "../Board/Board";
import CreateBoardForm from "../../../common/Components/CreateBoardForm/CreateBoardForm";
import { Flex, Box, Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Boards.css";

import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function Boards() {
    const [boards, setBoards] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    function getBoards(url) {
        axios.get(url).then((res) => {
            if (res.status == 200) {
                setBoards(res.data);
                setIsLoaded(true);
            }
        });
    }
    useEffect(() => {
        const url = `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`;
        getBoards(url);
    }, []);

    function showCreateBoardForm() {
        setIsFormOpen(!isFormOpen);
    }
    function CreateNewBoard() {
        return (
            <Popover>
                <PopoverTrigger>
                    <Box className={"board create-board"} bg="#333C43" h="8rem">
                        <Flex height="8rem" margin="auto" justify="center" align="center">
                            <Text margin="auto" color="white">
                                Create new board
                            </Text>
                        </Flex>
                    </Box>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Create Board</PopoverHeader>
                    <PopoverBody>
                        <CreateBoardForm getBoards={getBoards}></CreateBoardForm>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        );
    }
    if (isLoaded) {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"2rem"}>
                    <CreateNewBoard />
                    {boards.map((board) => {
                        return <Board key={board.id} board={board} />;
                    })}
                </Flex>
            </>
        );
    }
}

export default Boards;
