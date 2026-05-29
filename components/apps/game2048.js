import React, { useState, useEffect, useCallback, useRef } from 'react';

export default function Game2048() {
    const [board, setBoard] = useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const containerRef = useRef(null);

    // Initialize game
    const initGame = useCallback(() => {
        let newBoard = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        newBoard = addRandomTile(newBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setWon(false);
    }, []);

    useEffect(() => {
        const savedBest = localStorage.getItem('2048-best-score');
        if (savedBest) {
            setBestScore(parseInt(savedBest, 10));
        }
        initGame();
    }, [initGame]);

    function addRandomTile(currentBoard) {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length === 0) return currentBoard;

        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const nextBoard = currentBoard.map(row => [...row]);
        nextBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
        return nextBoard;
    }

    const slideLeft = useCallback((currentBoard) => {
        let newBoard = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        let currentScore = 0;
        let changed = false;

        for (let r = 0; r < 4; r++) {
            let row = currentBoard[r].filter(val => val !== 0);
            let nextRow = [];
            for (let i = 0; i < row.length; i++) {
                if (row[i] === row[i + 1]) {
                    nextRow.push(row[i] * 2);
                    currentScore += row[i] * 2;
                    i++;
                } else {
                    nextRow.push(row[i]);
                }
            }
            while (nextRow.length < 4) {
                nextRow.push(0);
            }
            newBoard[r] = nextRow;
            if (JSON.stringify(newBoard[r]) !== JSON.stringify(currentBoard[r])) {
                changed = true;
            }
        }
        return { board: newBoard, score: currentScore, changed };
    }, []);

    const reverseRows = (matrix) => {
        return matrix.map(row => [...row].reverse());
    };

    const transpose = (matrix) => {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    };

    function hasAvailableMoves(currentBoard) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) return true;
                if (r < 3 && currentBoard[r][c] === currentBoard[r + 1][c]) return true;
                if (c < 3 && currentBoard[r][c] === currentBoard[r][c + 1]) return true;
            }
        }
        return false;
    }

    const handleKeyDown = useCallback((e) => {
        if (gameOver) return;

        let moveResult = null;
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            moveResult = slideLeft(board);
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            const reversed = reverseRows(board);
            const res = slideLeft(reversed);
            moveResult = {
                board: reverseRows(res.board),
                score: res.score,
                changed: res.changed
            };
        } else if (e.key === 'ArrowUp' || e.key === 'w') {
            const transposed = transpose(board);
            const res = slideLeft(transposed);
            moveResult = {
                board: transpose(res.board),
                score: res.score,
                changed: res.changed
            };
        } else if (e.key === 'ArrowDown' || e.key === 's') {
            const transposed = transpose(board);
            const reversed = reverseRows(transposed);
            const res = slideLeft(reversed);
            moveResult = {
                board: transpose(reverseRows(res.board)),
                score: res.score,
                changed: res.changed
            };
        }

        if (moveResult && moveResult.changed) {
            e.preventDefault();
            let nextBoard = moveResult.board;
            const addedScore = moveResult.score;
            const newScore = score + addedScore;
            setScore(newScore);

            if (newScore > bestScore) {
                setBestScore(newScore);
                localStorage.setItem('2048-best-score', newScore);
            }

            nextBoard = addRandomTile(nextBoard);
            setBoard(nextBoard);

            let hasWon = false;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (nextBoard[r][c] === 2048) {
                        hasWon = true;
                    }
                }
            }
            if (hasWon && !won) {
                setWon(true);
            }

            if (!hasAvailableMoves(nextBoard)) {
                setGameOver(true);
            }
        }
    }, [board, score, bestScore, won, gameOver, slideLeft]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    const getTileColors = (val) => {
        switch (val) {
            case 2: return 'bg-[#eee4da] text-[#776e65]';
            case 4: return 'bg-[#ede0c8] text-[#776e65]';
            case 8: return 'bg-[#f2b179] text-[#f9f6f2]';
            case 16: return 'bg-[#f59563] text-[#f9f6f2]';
            case 32: return 'bg-[#f67c5f] text-[#f9f6f2]';
            case 64: return 'bg-[#f65e3b] text-[#f9f6f2]';
            case 128: return 'bg-[#edcf72] text-[#f9f6f2] shadow-[0_0_10px_2px_rgba(237,207,114,0.5)]';
            case 256: return 'bg-[#edcc61] text-[#f9f6f2] shadow-[0_0_10px_3px_rgba(237,204,97,0.6)]';
            case 512: return 'bg-[#edc850] text-[#f9f6f2] shadow-[0_0_10px_4px_rgba(237,200,80,0.6)]';
            case 1024: return 'bg-[#edc53f] text-[#f9f6f2] shadow-[0_0_12px_5px_rgba(237,197,63,0.7)] text-[20px]';
            case 2048: return 'bg-[#edc22e] text-[#f9f6f2] shadow-[0_0_15px_7px_rgba(237,194,46,0.8)] text-[20px]';
            default: return 'bg-[#3c3a32] text-[#f9f6f2]';
        }
    };

    return (
        <div 
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="w-full h-full flex flex-col bg-[#faf8ef] select-none font-sans overflow-y-auto outline-none"
        >
            {/* Header / Toolbar */}
            <div className="bg-[#ebdcd0] text-[11px] text-[#776e65]/80 px-4 py-1.5 flex justify-between items-center font-sans border-b border-[#ebdcd0]/30 flex-shrink-0">
                <span className="flex items-center space-x-1.5 font-bold">
                    <span>2048 Classic</span>
                </span>
                <span className="text-[10px] text-[#776e65]/60">Use Arrow keys or WASD to play</span>
            </div>

            {/* Game Content */}
            <div className="flex-grow flex flex-col justify-center items-center p-4 min-h-0">
                {/* Score panel */}
                <div className="w-full max-w-[280px] flex justify-between items-center mb-3">
                    <div className="text-2xl font-bold text-[#776e65]">2048</div>
                    <div className="flex space-x-2">
                        <div className="bg-[#bbada0] rounded px-3 py-1 text-center min-w-[55px]">
                            <div className="text-[9px] uppercase font-bold text-[#eee4da]">Score</div>
                            <div className="text-xs font-bold text-white leading-none">{score}</div>
                        </div>
                        <div className="bg-[#bbada0] rounded px-3 py-1 text-center min-w-[55px]">
                            <div className="text-[9px] uppercase font-bold text-[#eee4da]">Best</div>
                            <div className="text-xs font-bold text-white leading-none">{bestScore}</div>
                        </div>
                    </div>
                </div>

                {/* Subtitle / New Game Button */}
                <div className="w-full max-w-[280px] flex justify-between items-center mb-3">
                    <div className="text-[10px] text-[#776e65] max-w-[180px] leading-tight">
                        Join the tiles, get to <strong>2048!</strong>
                    </div>
                    <button 
                        onClick={initGame} 
                        className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white text-[10px] font-bold py-1.5 px-3 rounded transition-colors"
                    >
                        New Game
                    </button>
                </div>

                {/* Grid Board */}
                <div className="relative w-full max-w-[280px] aspect-square bg-[#bbada0] p-2.5 rounded-lg flex flex-col justify-between">
                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-[#eee4da]/75 flex flex-col justify-center items-center z-20 rounded-lg animate-fade-in">
                            <div className="text-3xl font-bold text-[#776e65] mb-2">Game Over!</div>
                            <button 
                                onClick={initGame} 
                                className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Win Overlay */}
                    {won && !gameOver && (
                        <div className="absolute inset-0 bg-[#edc22e]/85 flex flex-col justify-center items-center z-20 rounded-lg animate-fade-in">
                            <div className="text-3xl font-bold text-white mb-2">You Win!</div>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setWon(false)} 
                                    className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                                >
                                    Keep going
                                </button>
                                <button 
                                    onClick={initGame} 
                                    className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                                >
                                    Restart
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tiles */}
                    <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full w-full">
                        {board.map((row, r) => 
                            row.map((val, c) => (
                                <div 
                                    key={`${r}-${c}`} 
                                    className={`relative rounded-md flex items-center justify-center font-bold text-2xl aspect-square transition-all duration-100 ${
                                        val === 0 ? 'bg-[#eee4da]/35' : getTileColors(val)
                                    }`}
                                >
                                    {val > 0 ? val : ''}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const displayGame2048 = () => {
    return <Game2048 />;
}
