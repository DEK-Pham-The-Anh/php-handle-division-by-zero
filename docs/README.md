# Handling division by zero in PHP


## PHP 7

In PHP 7, the result of a division by zero is `INF` (infinity), also a warning is returned. 


### Method 1 - Wrapper function

You could use a wrapper function to return a number instead of `INF`.

1. Create a wrapper function in php - for example:
```
function nanInfToZero($division) {
	if (is_nan($division) || is_infinite($division)) {
		return 0;      // handle this somehow
	}
	return $division;
}
```
2. Use the wrapper function for divisons in your php code - https://dek-pham-the-anh.github.io/php-wrapping-function/index1.html.


#### Examples
- `$x = $a + $b / ($c - $d) + $e;` → `$x = $a + nanInfToZero($b / ($c - $d)) + $e;`


## PHP 8

PHP 8 returns an error whenever you try to divide by zero. Thus, it's necessary to check every divisor for its potential zero value.


### Method 1 - Ternary operators

If you have only few cases of division in your code, you could use a ternary operators to check if the divisor is zero - https://dek-pham-the-anh.github.io/php-wrapping-function/index2.html 


#### Examples
- `$x = $a + $b / ($c - $d) + $e;` → `$x = $a + (($c - $d) != 0 ? $b / ($c - $d) : 0) + $e;`


### Method 2 - Wrapper function

If you have many cases of division in your code, you could use a global wrapper function bypass `PHP 8`'s error reporting.

1. Create a wrapper function in php - for example:
```
function safeDiv($dividend, $divisor, $result = 0) {
	if ($divisor == 0) {
		return $result;
	}

	return $dividend / $divisor;
}
```
2. Use the wrapper function for divisons in your php code - https://dek-pham-the-anh.github.io/php-wrapping-function/index3.html.


#### Examples
- `$x = $a + $b / ($c - $d) + $e;` → `$x = $a + safeDiv($b, ($c - $d)) + $e;`