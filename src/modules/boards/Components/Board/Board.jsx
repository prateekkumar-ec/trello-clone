import "./Board.css";
import StarIcon from "../../../../assets/starIcon.svg";

function Board({ board }) {
    const { backgroundImageScaled } = board.prefs;
    const { name } = board;

    return (
        <div className={"board"} style={{ background: "url(" + backgroundImageScaled[2].url + ")", backgroundSize: "100% 100%" }}>
            <div className="board-details">
                <div className="board-details-name">
                    <div>{name}</div>
                </div>
                <img src={StarIcon}></img>
            </div>
        </div>
    );
}
export default Board;
