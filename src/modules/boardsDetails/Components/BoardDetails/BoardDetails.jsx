import { useParams } from "react-router-dom";
import BoardList from "../BoardList/BoardList";
import { useEffect, useState } from "react";
import { Flex, Container, Editable, EditableInput, EditableTextarea, EditablePreview, List } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import "./BoardDetails.css";

import axios from "axios";
function BoardDetails() {
    const { id } = useParams();
    const [boardLists, setBoardLists] = useState();
    const [boardImage, setBoardImage] = useState();
    const [isListsLoaded, setIsListsLoaded] = useState(false);

    useEffect(() => {
        getBoardLists();
        getBoardImage();
    }, []);

    function getBoardLists() {
        axios(
            `https://api.trello.com/1/boards/${id}/lists?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "GET",
            }
        )
            .then((res) => {
                setBoardLists(res.data);
                setIsListsLoaded(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    function getBoardImage() {
        axios(`https://api.trello.com/1/boards/${id}?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`, {
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
        axios(
            `https://api.trello.com/1/lists?name=${event}&idBoard=${id}&key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "POST",
            }
        )
            .then((response) => {
                getBoardLists();
            })
            .catch((err) => console.error(err));
    }

    if (isListsLoaded) {
        return (
            <>
                <div className="board-bg-container" style={{ background: boardImage }}>
                    <div className={"board-lists-flex"}>
                        {boardLists.map((list) => {
                            return <BoardList key={list.id} list={list} getBoardLists={getBoardLists}></BoardList>;
                        })}
                        <div className="board-list">
                            <List background="#485F6C" color="#172B4D" padding={"1rem"} borderRadius={"7px"}>
                                <Flex gap={"1rem"} alignItems={"center"}>
                                    <AddIcon />
                                    <Editable onSubmit={createNewList} placeholder={"Add another list"} defaultValue="">
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
    }
}

export default BoardDetails;
