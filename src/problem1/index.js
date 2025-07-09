var sum_to_n_a = function(n) {
    // your code here
    return n * (n + 1) / 2;
};

var sum_to_n_b = function(n) {
    // your code here
    if(n===0){
        return 0
    }
    return n + sum_to_n_b(n-1);
};

var sum_to_n_c = function(n) {
     // your code here
    return [...Array(n + 1).keys()].reduce((acc, curr) => acc + curr, 0);
};

// Export functions for testing
module.exports = {
    sum_to_n_a,
    sum_to_n_b,
    sum_to_n_c
};