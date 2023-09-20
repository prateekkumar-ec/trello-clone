import { FormControl, Input, Button, Flex, Stack, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import "./CreateBoardForm.css";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;
function CreateBoardForm({ getBoards }) {
    const [isCreateDisable, setIsCreateDisable] = useState(true);
    const [newBoardName, setNewBoardName] = useState("");
    function handleBordTitleInput(event) {
        if (event.target.value != "") {
            setIsCreateDisable(false);
            setNewBoardName(event.target.value);
        } else {
            setIsCreateDisable(true);
        }
    }
    function createBoard() {
        axios(`https://api.trello.com/1/boards/?name=${newBoardName}&key=${apiKey}}&token=${token}`, {
            method: "POST",
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                getBoards(`https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${token}`);
            })
            .catch((err) => console.error(err));
    }
    return (
        <Stack spacing={4}>
            <FormControl>
                <FormLabel>Board Title</FormLabel>
                <Input onChange={handleBordTitleInput} id="boardName"></Input>
            </FormControl>
            <Button color={"green"} isDisabled={isCreateDisable} variant="outline" onClick={createBoard}>
                Create
            </Button>
        </Stack>
    );
}
export default CreateBoardForm;
