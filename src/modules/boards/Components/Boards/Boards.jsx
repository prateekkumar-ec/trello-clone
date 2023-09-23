import { useEffect, useState, useReducer } from "react";
import { useToast, Flex, Box, Text, Spinner, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverCloseButton } from "@chakra-ui/react";
import axios from "axios";

import CreateBoardForm from "../../../common/Components/CreateBoardForm/CreateBoardForm";
import Board from "../Board/Board";

import config from "../../../../../config";
import "./Boards.css";

const apiKey = config.apiKey;
const token = config.token;

function Boards() {
    const [boards, dispatchBoards] = useReducer(boardsReducer, { data: [], isLoaded: false, isError: false });

    const toast = useToast();

    useEffect(() => {
        getBoards();
    }, []);

    function getBoards() {
        axios
            .get(`https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`)
            .then((res) => {
                if (res.status == 200) {
                    dispatchBoards({
                        type: "get",
                        data: res.data,
                    });
                }
            })
            .catch((error) => {
                dispatchBoards({
                    type: "error",
                    error: error,
                });
            });
    }
    function showCreateBoardForm() {
        setIsFormOpen(!isFormOpen);
    }

    if (boards.isLoaded) {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"2rem"}>
                    <CreateNewBoard dispatchBoards={dispatchBoards} boards={boards} />
                    {boards.data.map((board) => {
                        return <Board key={board.id} board={board} />;
                    })}
                </Flex>
            </>
        );
    } else {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"15rem"} justify={"center"}>
                    {boards.isError ? <Text color={"white"}>{"Problem is in boards"}</Text> : <Spinner color="white"></Spinner>}
                </Flex>
            </>
        );
    }
}

function CreateNewBoard({ dispatchBoards, boards }) {
    return (
        <Popover offset={[300, -150]}>
            <PopoverTrigger>
                <Box className={"board create-board"} bg="#333C43" h="8rem">
                    <Flex height="8rem" margin="auto" justify="center" align="center">
                        <Text margin="auto" color="white">
                            Create new board
                        </Text>
                    </Flex>
                </Box>
            </PopoverTrigger>
            <PopoverContent background={"#282E33"} color="#B6C2CF">
                <PopoverCloseButton />
                <PopoverHeader>Create Board</PopoverHeader>
                <PopoverBody>
                    <CreateBoardForm dispatchBoards={dispatchBoards} boards={boards}></CreateBoardForm>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
function boardsReducer(boards, action) {
    switch (action.type) {
        case "get": {
            return { ...boards, data: action.data, isLoaded: true };
        }
        case "add": {
            return [...boards, action.data];
        }
        case "error": {
            return { ...boards, isLoaded: false, isError: action.error };
        }
    }
}
export default Boards;
