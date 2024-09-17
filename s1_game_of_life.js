// This is arbitary sized Conway's Game of Life, in Source 1
// Limitations: Square boards, with sides being a power of 2
// (due to not wanting to handle special cases of chosen data structure)

import {
    animate_rune, show,
    square,
    white,
    beside, stack
} from 'rune'; 

// alternate pair definition, optimised for tokens
// head(pair(...)) === p(...)(true)
// tail(pair(...)) === p(...)(false)
const p = (x, y) => c => c ? x : y;
// this leads to an alternate list definitions
// unterminated - p(x0, p(x1, p(x2, x3)))
// (unused here, was used in development)
// terminated - p(x0, p(x1, p(x2, p(x3, undefined))))
// the tail is not defined to be any specific value
// as long as it isnt a function its fine

// nom 
const nom = _ => nom;
// WARNING! - passes the pair check (is_function)
// this is useful to pass in circumstances that expect a list/tree
// to eat up the head/tails


// DEBUG FUNCTIONS
//*
// debug display function
const d = l => {
    if (is_function(l)) {
        // nom check
        // well i cant compare functions so
        // more like function of one parameter starting with _ check
        if (char_at(stringify(l), 0) === '_') {
            display('nom');
        } else {
            display(l(true), 'elem');
            d(l(false));
        }
    } else {
        display(l, 'end tag');
    }
    return l;
};

// when passed in as a list/binary tree,
// returns a list of the booleans passed to it reversed (tagged undefined)
const _m = l => b => is_undefined(b) ? l : _m(p(b, l));
const mock = _m(undefined);
// */


// convert balanced binary tree into runes
// tree is treated as a H tree
const r = p => 
    is_function(p)
    ? beside(
        stack(
            r(p(true)(true)),
            r(p(true)(false))
        ), stack(
            r(p(false)(true)),
            r(p(false)(false))
        )
    )
    : p ? square : white(square);

// traverse balanced binary tree `s` in reverse order of `l`
const t = (s, l) => is_function(l) ? t(s, l(false))(l(true)) : s;

// heart of the system - used to find surrounding squares
// combination of t with c1 (change1) that only applies once every 2 bits
// recurses into a different t2c1 instance (with possibly different m)
// to handle the other bits, and back again
// change1 adds or subtracts based on m
// m - minus. true - sub, false - add, undefined - no change
// l - terminated list of 2 least signicant bit first binary numbers
// stored in alternating fashion
// f - function to recurse into
// if overflow returns nom (note: is_function(nom) === true)
// else element of s (assuming proper length of l)
// warning - length too short cannot be distingushed
// from overflow / underflow without stringification
// (solution - just dont do length too short)
const t2c1 = m => (s, l, f) =>
    is_undefined(m)
    ? is_function(l)
    ? f(s, l(false), t2c1(undefined))(l(true))
    : is_undefined(f) // true when | if m === 0 for the given f
    ? s // end                    \/ 
    : f(s, 0, undefined) // m !== undefined, !is_function(l) -> overflow 
    : is_function(l) //   (       xor      )?carry:end carry
    ? f(s, l(false), t2c1((l(true) ? !m : m) ? m : undefined))(!l(true))
    : nom; // overflow;


// no cast
const int = b => !is_function(b) && b ? 1 : 0;
const i = f => f(true) + f(false) + f(undefined);


const n = s => ti => {
    // function to determine new square
    // l is path to current square
    // to is filled squares in 3x3 centered on current
    // this implemenation is Conway's Game of Life
    const test = (l, to) => to === 3 || to === 4 && t(s, l);

    const g = (l, n) => 
        n === 0
        ? test(l, i(a => i(b => int(t2c1(a)(s, l, t2c1(b))))))
        : p(g(p(true, l), n - 1), g(p(false, l), n - 1));
    
    // The 1 here is 1/FPS
    return ti <= 0 ? r(s) : n(g(0, depth))(ti - 1);
};


// Depth of the state tree
// (2log_2(n)) where n is side length
const depth = 6; // 4 for 4x4

// State tree definition (you can change some booleans and see what happens!)
/*
// 8x8
const s = p(
    p(
        p(
            p(
                p(p(false, true), p(false, true)),
                p(p(true, false), p(true, false))
            ), p(
                p(p(true, true), p(true, true)),
                p(p(true, false), p(true, false))
            )
        ), p(
            p(
                p(p(false, false), p(false, false)),
                p(p(false, true), p(false, true))
            ), p(
                p(p(false, true), p(true, true)),
                p(p(false, false), p(false, false))
            )
        )
    ), p(
        p(
            p(
                p(p(false, true), p(false, true)),
                p(p(true, false), p(true, false))
            ), p(
                p(p(true, true), p(true, true)),
                p(p(true, false), p(true, false))
            )
        ), p(
            p(
                p(p(false, false), p(false, false)),
                p(p(true, true), p(false, true))
            ), p(
                p(p(false, true), p(false, true)),
                p(p(false, false), p(false, false))
            )
        )
    )
);
// */
// 4x4
/*
const s = p(
    p(
        p(p(false, false), p(false, false)),
        p(p(false, false), p(true, false))
    ), p(
        p(p(false, false), p(false, false)),
        p(p(true, false), p(true, false))
    )
);
// */





// Convenience Functions
// (requires Source 2 to enable list(...varargs))
//* 
const end = n => l => n === 0 ? l : end(n - 1)(tail(l));
const to_s = (f0, f1, n, mat) => 
    n === -1
    ? head(head(mat))
    : p(
        to_s(f1, f0, n - 1, mat),
        to_s(f1, f0, n - 1, f0(math_pow(2, math_floor(n / 2)))(mat))
    );

const side = math_pow(2, depth / 2);

const s = to_s(
    n => l => map(end(n), l),
    end,
    depth - 1,
    list(
        list(false, false, false, false, false, false, false, false),
        list(false, false, false, false, false, false, false, false),
        list(false, false, false, true, true, false, false, false),
        list(false, false, true, true, false, false, false, false),
        list(false, false, false, true, false, false, false, false),
        list(false, false, false, false, false, false, false, false),
        list(false, false, false, false, false, false, false, false),
        list(false, false, false, false, false, false, false, false)
    )
);
// */

//        Iterations
//            | FPS (must change in n too)
animate_rune(20, 1, n(s));