import {
    show, animate_rune,
    square,
    white,
    beside, stack
} from 'rune'; 

// alternate pair definition, optimised for tokens
// head(pair(...)) === p(...)(true)
// tail(pair(...)) === p(...)(false)
const p = (x, y) => c => c ? x : y;
// this leads to an alternate list definitions
// p(x0, p(x1, p(x2, x3)))
// undelimited
// p(x0, p(x1, p(x2, p(x3, undefined))))
// the tail is not defined to be any specific value, can be used to tag lists

// nul - list of itself
const nul = _ => nul;
// THIS NUL IS VERY DIFFERENT FROM A NORMAL null!
// for one it passes the pair check (is_function)
// this is useful to pass in circumstances that expect a list/tree
// to eat up the head/tails

const d = l => {
    if (is_function(l)) {
        // nul check
        // well i cant compare functions so
        // more like one parameter starting with _ check
        if (char_at(stringify(l), 0) === '_') {
            display('nul');
        } else {
            display(l(true), 'elem');
            d(l(false));
        }
    } else {
        display(l, 'end tag');
    }
    return l;
};

// convert balanced binary tree into runes
const c = p => 
    is_function(p)
    ? beside(
        stack(
            c(p(true)(true)),
            c(p(true)(false))
        ), stack(
            c(p(false)(true)),
            c(p(false)(false))
        )
    )
    : p ? square : white(square);

// traverse balanced binary tree `s` according to `l`
const t_n = (s, l) => is_function(l) ? t(s(l(true)), l(false)) : s(l);

// traverse balanced binary tree `s` in reverse order of `l`
const t = (s, l) => is_function(l) ? t(s, l(false))(l(true)) : s(l);

// toggle first `b` in `l`,
// but tries to eat 2 elements instead of 1 after comparision
// (effectively checking every second element except last element)
// and traverse element in `s`
// according to this changed `l` reversed and list `e`
// not found: false
const f = 
    (b, l, s, e) => 
        is_function(display(l, 'aa')) && is_function(display(l(false)))
        ? (l(true) ? b : !b) // no comparing booleans???
            ? t_n(t(display(s, 'aaa'), d(l(false)))(display(!b, 'b')), d(e))
            : f(b, l(false)(false), s, p(l(false)(true), p(l(true), e)))
        : false;

// m: bool - whether we are doing -1, otherwise +1
// l: list[bool] - the binary number in reverse order
const pm1 = (l, m) =>
    is_function(l)
    ? (l(true) ? !m : m) // xor
    ? p(m, pm1(l(false), m)) // carry. m === !l(true)
    : p(!m, l(false)) // carry end. m === l(true)
    : undefined; // overflow, tag undefined

// combination of t with 2 different change1, alternated between
// treat l as terminated list of 2 binary numbers alternating reversed
// change1 adds or subtracts based
// f, f_a - function to recurse into, pass t2pm1 to recurse into itself
// if overflow returns nul (note: is_function(nul) === true)
// else element of s (assuming proper length of l)
// warning - length too short cannot be distingushed
// from overflow / underflow without stringification
const t2c1 = (s, l, m, m_a, f, f_a) =>
    is_function(d(display(l, 'c1')))
    ? (l(true) ? !m : m) // xor
    ? f(s, l(false), m_a, m, f_a, f)(m) // carry. m === !l(true). alternate
    // carry end. m === l(true), early end
    : f(s, l(false), m_a, display(m, 'carry end'), t2c0, f)(!m)
    : display(nul); // overflow

// recurse deeper without modification (change 0)
const t2c0 = (s, l, m, m_a, f, f_a) =>
    // f_a === t2c0
    is_function(d(display(l, 'c0')))
    ? f(s, l(false), m_a, m, f_a, f)(l(true))
    : is_undefined(m) // true when | with f === t2c0
    ? s //                        \/ 
    : f(0, 0, undefined, 0, 0, 0); // f === t2c1, !is_function(l) => overflow 
// note: can early end by comparing if f === t2c0
// IF WE COULD COMPARE FUNCTIONS


// when passed in as a list/binary tree,
// returns a list of the booleans passed to it reversed (tagged undefined)
const _m = l => b => is_undefined(b) ? l : _m(p(b, l));
const mock = _m(undefined);

d(
    t2c1(
        mock,
        p(true, p(true, p(true, p(true, p(true, undefined))))),
        false, true, t2c1, t2c1
    )(undefined)
);
const n = s => {
    const g = (b, n, f) => {
        if (n === 0) {
            return f(l);
        } else {
            g(true, n - 1, f);
            g(false, n - 1, f);
        }
    };
    const l = p(false, p(false, p(true, true)));
    t(s, p(!l(true), l(false)));
    t(s, p(l(true), p(!l(false), l(false)(false))));
    //f(l(true), )
    
};
const s = p(
    p(
        p(
            p(p(p(false, true), p(false, true)), p(p(true, false), p(true, false))),
            p(p(p(true, true), p(true, true)), p(p(true, false), p(true, false)))
        ),
        p(
            p(p(p(false, false), p(false, false)), p(p(false, true), p(false, true))),
            p(p(p(false, true), p(false, true)), p(p(false, false), p(false, false)))
        )
    ),
    p(
        p(
            p(p(p(false, true), p(false, true)), p(p(true, false), p(true, false))),
            p(p(p(true, true), p(true, true)), p(p(true, false), p(true, false)))
        ),
        p(
            p(p(p(false, false), p(false, false)), p(p(true, true), p(false, true))),
            p(p(p(false, true), p(false, true)), p(p(false, false), p(false, false)))
        )
    )
);

show(c(s));
display(t(s, p(false, p(true, p(true, p(true, p(true, true)))))));