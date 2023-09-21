import { useToast, FormControl, Input, Button, Flex, Stack, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import "./CreateBoardForm.css";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;
function CreateBoardForm({ boards, setBoards }) {
    const [isCreateDisable, setIsCreateDisable] = useState(true);
    const [newBoardName, setNewBoardName] = useState("");

    const toast = useToast();

    function handleBordTitleInput(event) {
        if (event.target.value != "") {
            setIsCreateDisable(false);
            setNewBoardName(event.target.value);
        } else {
            setIsCreateDisable(true);
        }
    }
    function createBoard() {
        axios(`https://api.trello.com/1/boards/?name=${newBoardName}&key=${apiKey}&token=${token}`, {
            method: "POST",
        })
            .then((response) => {
                setBoards([...boards, response.data]);
                toast({
                    title: " Created!",
                    description: "A new Board is created successfully.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            })
            .catch((err) => {
                toast({
                    title: "Failed to create board.",
                    description: "Try checking your network.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                console.error(err);
            });
    }
    return (
        <Stack spacing={4}>
            <FormControl>
                <FormLabel>Board Title</FormLabel>
                <Input onKeyDown={handleBordTitleInput} id="boardName"></Input>
            </FormControl>
            <Button className="create-board-button" color={"#1D2125"} background={"#85B8FF"} isDisabled={isCreateDisable} variant="outline" onClick={createBoard}>
                Create
            </Button>
        </Stack>
    );
}
export default CreateBoardForm;
