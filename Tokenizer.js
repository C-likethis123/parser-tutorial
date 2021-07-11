/**
 * Specification of read_next
 *  * skip whitespace
 *  * if EOF reached, return null
 *  * if it's a comment, skip to next line
 *  * if it's a quote, read a string
 *  * if a digit, read a number
 *  * if a "letter", read an identifier or keyword token
 *  * if punctuation, return a punctuation token
 *  * if an operator character, return an operator token
 *  * if none of the above, error out with input.croak()
 */

function TokenStream(charStream) {
  let current = null;
  const keywords = ["if", "then", "else", "lambda", "true", "false"];

  function is_keyword(char) {
    return keywords.includes(char);
  }

  function is_digit(char) {
    return /[0-9]/i.test(char);
  }

  function is_id_start(char) {
    return /[a-z_]/i.test(char);
  }

  function is_id(char) {
    return is_id_start(char) || /[?!0-9]/.test(char);
  }

  function is_op(char) {
    return /[\+\-\*\%\=\&\|\<\>\!]/.test(char);
  }

  function is_whitespace(char) {
    return [" ", "\t", "\n"].includes(char);
  }

  function read_while(predicate) {
    let str = "";
    while (!input.eof() && predicate(input.peek())) {
      str += input.next();
    }
    return str;
  }

  function read_number() {
    let has_dot = false;
    const number = read_while(ch => {
      if (ch === ".") {
        if (has_dot) {
          return false;
        }
        has_dot = true;
        return true;
      }
      return is_digit(ch);
    });
    return {
      type: "num",
      value: parseFloat(number),
    };
  }

  /**
   * Reads the value of an identifier, which is either a keyword ("kw")
   * or a user defined identifier ("var")
   */
  function read_ident() {
    const id = read_while(is_id);
    return {
      type: is_keyword(id) ? "kw" : "var",
      value: id,
    }
  }

  function read_escaped(end) {
    let escaped = false, str = "";
    input.next();
    while (!input.eof()) {
      const ch = input.next();
      if (escaped) {
        str += ch;
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === end) {
        break;
      } else {
        str += ch;
      }
    }
    return str;
  }

  function read_string() {
    return {
      type: "str",
      value: read_escaped('""'),
    };
  }
  function skip_comment() {
    read_while(function (ch) {return ch != "\n"});
    input.next();
  }
  function read_next() {
    read_while(is_whitespace);
    if (input.eof()) return null;
    var ch = input.peek();
    if (ch == "#") {
      skip_comment();
      return read_next();
    }
    if (ch == '"') return read_string();
    if (is_digit(ch)) return read_number();
    if (is_id_start(ch)) return read_ident();
    if (is_punc(ch)) return {
      type: "punc",
      value: input.next()
    };
    if (is_op_char(ch)) return {
      type: "op",
      value: read_while(is_op_char)
    };
    input.croak("Can't handle character: " + ch);
  }
  function peek() {
    return current || (current = read_next());
  }
  function next() {
    var tok = current;
    current = null;
    return tok || read_next();
  }
  function eof() {
    return peek() == null;
  }
  return {
    next,
    peek,
    eof,
    croak: input.croak,
  };
}
