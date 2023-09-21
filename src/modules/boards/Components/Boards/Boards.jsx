import { useEffect, useState } from "react";
import { useToast, Flex, Box, Text, Spinner, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverCloseButton } from "@chakra-ui/react";
import axios from "axios";

import CreateBoardForm from "../../../common/Components/CreateBoardForm/CreateBoardForm";
import Board from "../Board/Board";

import config from "../../../../../config";
import "./Boards.css";

const apiKey = config.apiKey;
const token = config.token;

function Boards() {
    const [boards, setBoards] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const toast = useToast();

    useEffect(() => {
        getBoards(setBoards, setIsLoaded, setIsError);
    }, []);

    function showCreateBoardForm() {
        setIsFormOpen(!isFormOpen);
    }

    if (isLoaded) {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"2rem"}>
                    <CreateNewBoard setBoards={setBoards} boards={boards} />
                    {boards.map((board) => {
                        return <Board key={board.id} board={board} />;
                    })}
                </Flex>
            </>
        );
    } else if (isLoaded == false) {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"15rem"} justify={"center"}>
                    {isError ? <Text color={"white"}>{isError.message}</Text> : <Spinner color="white"></Spinner>}
                </Flex>
            </>
        );
    }
}

function getBoards(setBoards, setIsLoaded, setIsError) {
    axios
        .get(`https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`)
        .then((res) => {
            if (res.status == 200) {
                setBoards(res.data);
                setIsLoaded(true);
            }
        })
        .catch((error) => {
            setIsError(error);
        });
}
function CreateNewBoard({ setBoards, boards }) {
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
                    <CreateBoardForm getBoards={getBoards} setBoards={setBoards} boards={boards}></CreateBoardForm>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
export default Boards;
