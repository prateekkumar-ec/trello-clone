import { FormControl, Input, Button, Flex, Stack, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import "./CreateBoardForm.css";
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
        axios(
            `https://api.trello.com/1/boards/?name=${newBoardName}&key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "POST",
            }
        )
            .then((response) => {
                return response;
            })
            .then((data) => {
                getBoards(
                    "https://api.trello.com/1/members/me/boards?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB"
                );
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
