import { useState } from "react";
import { Link } from "react-router-dom";

import "./Board.css";
import StarIcon from "../../../../assets/starIcon.svg";

function Board({ board }) {
    let { backgroundColor, backgroundImageScaled } = board.prefs;
    const [displayStar, setDisplayStar] = useState("");
    const { id } = board;
    function toggleStar() {
        if (displayStar == "star") {
            setDisplayStar("");
        } else {
            setDisplayStar("star");
        }
    }

    if (backgroundImageScaled) {
        return (
            <div
                onMouseEnter={toggleStar}
                onMouseLeave={toggleStar}
                className={"board"}
                style={{ background: "url(" + backgroundImageScaled[2].url + ")", backgroundSize: "100% 100%" }}
            >
                <BoardContent board={board} displayStar={displayStar}></BoardContent>
            </div>
        );
    } else {
        return (
            <div onMouseEnter={toggleStar} onMouseLeave={toggleStar} className={"board"} style={{ backgroundColor: backgroundColor }}>
                <BoardContent board={board} displayStar={displayStar}></BoardContent>
            </div>
        );
    }
}

function BoardContent({ board, displayStar }) {
    return (
        <Link to={"/boards/" + board.id}>
            <div className="board-details">
                <div className="board-details-name">
                    <div>{board.name}</div>
                </div>
                <img className={displayStar} src={StarIcon}></img>
            </div>
        </Link>
    );
}
export default Board;
