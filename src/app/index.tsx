import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  /**
   * 2. LOGIKA PERMAINAN (Game Logic & Winning Line)
   * Diperbarui agar mengembalikan objek berisi pemenang dan indeks garis kemenangan.
   */
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris horizontal (0, 1, 2)
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom vertikal (3, 4, 5)
      [0, 4, 8], [2, 4, 6]            // Diagonal (6, 7)
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], lineIndex: i }; 
      }
    }
    return { winner: null, lineIndex: null };
  };

  const result = calculateWinner(board);
  const winner = result.winner;
  const winningLineIndex = result.lineIndex;
  const isBoardFull = board.every((square) => square !== null);

  /**
   * 3. EVENT HANDLER
   */
  const handlePress = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';

    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  /**
   * 4. KOMPONEN KOTAK (Dengan efek highlight pada kotak pemenang)
   */
  const renderSquare = (index) => {
    // Cek apakah kotak ini bagian dari garis kemenangan
    const isWinningSquare = winningLineIndex !== null && [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ][winningLineIndex].includes(index);

    return (
      <TouchableOpacity
        style={[
          styles.square,
          isWinningSquare && styles.winningSquare // Highlight kotak yang menang
        ]}
        onPress={() => handlePress(index)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.squareText,
          board[index] === 'X' ? styles.textX : styles.textO
        ]}>
          {board[index]}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Fungsi untuk merender garis kemenangan visual secara dinamis di atas papan
   */
  const renderWinningLine = () => {
    if (winningLineIndex === null) return null;

    // Menentukan style garis berdasarkan indeks kemenangan (0-7)
    const lineStyles = [
      styles.lineH0, styles.lineH1, styles.lineH2, // Horizontal
      styles.lineV0, styles.lineV1, styles.lineV2, // Vertikal
      styles.lineD1, styles.lineD2                // Diagonal
    ];

    return <View style={[styles.baseLine, lineStyles[winningLineIndex]]} />;
  };

  let status;
  if (winner) {
    status = `Pemenang: ${winner}!`;
  } else if (isBoardFull) {
    status = "Permainan Seri (Draw)!";
  } else {
    status = `Giliran Pemain: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.status}>{status}</Text>

      {/* Papan Permainan dibungkus Relative agar Garis bisa diposisikan di atasnya */}
      <View style={styles.boardContainer}>
        <View style={styles.board}>
          <View style={styles.row}>
            {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
          </View>
          <View style={styles.row}>
            {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
          </View>
          <View style={styles.row}>
            {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
          </View>
        </View>

        {/* Render Garis Kemenangan */}
        {renderWinningLine()}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Mulai Ulang</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/**
 * 5. STYLING (Gaya Tampilan Termasuk Garis Kemenangan)
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '600',
    color: '#555',
  },
  boardContainer: {
    position: 'relative', // Penting agar garis absolut berada tepat di atas papan
  },
  board: {
    borderWidth: 4,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winningSquare: {
    backgroundColor: '#e8f8f5', // Warna latar belakang lembut untuk kotak pemenang
  },
  squareText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  textX: {
    color: '#e74c3c',
  },
  textO: {
    color: '#3498db',
  },
  
  // --- Styling Garis Kemenangan ---
  baseLine: {
    position: 'absolute',
    backgroundColor: '#2ecc71', // Warna hijau terang untuk garis kemenangan
    borderRadius: 4,
  },
  // Garis Horizontal (0, 1, 2)
  lineH0: { top: 43, left: 10, width: 250, height: 6 },
  lineH1: { top: 133, left: 10, width: 250, height: 6 },
  lineH2: { top: 223, left: 10, width: 250, height: 6 },
  // Garis Vertikal (3, 4, 5)
  lineV0: { top: 10, left: 43, width: 6, height: 250 },
  lineV1: { top: 10, left: 133, width: 6, height: 250 },
  lineV2: { top: 10, left: 223, width: 6, height: 250 },
  // Garis Diagonal (6, 7)
  lineD1: { 
    top: 132, 
    left: -22, 
    width: 314, 
    height: 6, 
    transform: [{ rotate: '45deg' }] 
  },
  lineD2: { 
    top: 132, 
    left: -22, 
    width: 314, 
    height: 6, 
    transform: [{ rotate: '-45deg' }] 
  },

  resetButton: {
    marginTop: 30,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});