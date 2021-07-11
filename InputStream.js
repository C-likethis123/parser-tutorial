/**
 * A stream object which provides operations to read characters from a string.
 * Usage: `const stream = InputStream(string)`
 */

function InputStream(input) {
  const pos = 0, line = 1, col = 0;
  /**
   * Returns the next value and discards it from the stream
   */
  function next() {
    const ch = input.charAt(pos++);
    if (ch === "\n") {
      line++;
      col = 0;
    } else {
      col++;
    }
    return ch;
  }

  /**
   * Returns the next value but does not remove it from the stream
   */
  function peek() {
    return input.charAt(pos);
  }

  /**
   * Returns true if there are no more values in the stream
   */
  function eof() {
    return peek() === "";
  }

  /**
   * Throws a new Error message along with the line and column where the error occurred
   */
  function croak(msg) {
    throw new Error(`${msg} (${line}: ${col})`);
  }
  return {
    next,
    peek,
    eof,
    croak,
  };
}
