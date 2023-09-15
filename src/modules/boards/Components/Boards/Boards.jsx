import axios from "axios";
import Board from "../Board/Board";
import CreateBoardForm from "../../../common/Components/CreateBoardForm/CreateBoardForm";
import { Flex, Box, Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Boards.css";
function Boards() {
    const [boards, setBoards] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);
    function getBoards(url) {
        axios.get(url).then((res) => {
            if (res.status == 200) {
                setBoards(res.data);
                setIsLoaded(true);
            }
        });
    }
    useEffect(() => {
        const url =
            "https://api.trello.com/1/members/me/boards?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB";
        getBoards(url);
    }, []);

    function CreateNewBoard() {
        return (
            <Box className={"board"} bg="#333C43" h="8rem">
                <Flex height="8rem" margin="auto" justify="center" align="center">
                    <Text margin="auto" color="white">
                        Create new board
                    </Text>
                </Flex>
            </Box>
        );
    }
    if (isLoaded) {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"2rem"}>
                    <CreateNewBoard />
                    {isFormOpen && <CreateBoardForm />}
                    {boards.map((board) => {
                        return <Board key={board.id} board={board} />;
                    })}
                </Flex>
            </>
        );
    }
}

export default Boards;
