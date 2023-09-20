import { useParams } from "react-router-dom";
import BoardList from "../BoardList/BoardList";
import { useEffect, useState } from "react";
import { Flex, Spinner, Editable, EditableInput, EditableTextarea, EditablePreview, List } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import "./BoardDetails.css";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

import axios from "axios";
function BoardDetails() {
    const { id } = useParams();
    const [boardLists, setBoardLists] = useState();
    const [boardImage, setBoardImage] = useState();
    const [isListsLoaded, setIsListsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getBoardLists();
        getBoardImage();
    }, []);

    function getBoardLists() {
        axios(`https://api.trello.com/1/boards/${id}/lists?key=${apiKey}&token=${token}`, {
            method: "GET",
        })
            .then((res) => {
                setBoardLists(res.data);
                setIsListsLoaded(true);
            })
            .catch((error) => {
                setIsError(true);
                console.log(error);
            });
    }
    function getBoardImage() {
        axios(`https://api.trello.com/1/boards/${id}?key=${apiKey}&token=${token}`, {
            method: "GET",
        })
            .then((res) => {
                if (res.data.prefs.backgroundImageScaled != null) {
                    let url = "url(" + res.data.prefs.backgroundImageScaled[6].url + ")";
                    setBoardImage(url);
                } else {
                    setBoardImage(res.data.prefs.backgroundColor);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function createNewList(event) {
        if (event == "") {
            return;
        }
        axios(
            `https://api.trello.com/1/lists?name=${event}&idBoard=${id}&key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "POST",
            }
        )
            .then((response) => {
                setBoardLists([...boardLists, response.data]);
            })
            .catch((err) => console.error(err));
    }

    if (isListsLoaded) {
        return (
            <>
                <div className="board-bg-container" style={{ background: boardImage }}>
                    <div className={"board-lists-flex"}>
                        {boardLists.map((list) => {
                            return <BoardList key={list.id} list={list} boardLists={boardLists} setBoardLists={setBoardLists}></BoardList>;
                        })}
                        <div className="board-list">
                            <List background="#485F6C" color="#172B4D" padding={"1rem"} borderRadius={"7px"}>
                                <Flex gap={"1rem"} alignItems={"center"}>
                                    <AddIcon />
                                    <Editable onSubmit={createNewList} submitOnBlur={false} placeholder={"Add another list"}>
                                        <EditablePreview cursor={"pointer"} />
                                        <EditableInput />
                                    </Editable>
                                </Flex>
                            </List>
                        </div>
                    </div>
                </div>
            </>
        );
    } else if (isListsLoaded == false) {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"15rem"} justify={"center"}>
                    {isError ? <Text color={"white"}>Error</Text> : <Spinner color="white"></Spinner>}
                </Flex>
            </>
        );
    }
}

export default BoardDetails;
