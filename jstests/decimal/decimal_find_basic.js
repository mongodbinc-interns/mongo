// Tests finding NumberDecimal from the shell.

(function() {
    "use strict";
    var col = db.decimal_find_basic;
    col.drop();

    // Insert some sample data.

    assert.writeOK(col.insert([
        { "decimal": NumberDecimal("0") },
        { "decimal": NumberDecimal("0.00") },
        { "decimal" : NumberDecimal("-0") },
        { "decimal" : NumberDecimal("1.0") },
        { "decimal" : NumberDecimal("1.00") },
        { "decimal" : NumberDecimal("2.00") },
        { "decimal" : NumberDecimal("12345678901234567890.12345678901234") },
        { "decimal" : NumberDecimal("NaN") },
        { "decimal" : NumberDecimal("-NaN") },
        { "decimal" : NumberDecimal("Infinity") },
    ]), "Initial insertion of decimals failed");

    // Zeros
    assert.eq(col.find({ "decimal" : NumberDecimal("0") }).count(), "3");

    // NaNs
    assert.eq(col.find({ "decimal" : NumberDecimal("NaN") }).count(), 2, "NaN find failed");

    var theNaNs = col.find({ "decimal": NumberDecimal("NaN")});
    assert(bsonWoCompare(theNaNs[0].decimal, NumberDecimal("NaN")) == 0, "NaN compares equal");
    assert(bsonWoCompare(theNaNs[1].decimal, NumberDecimal("NaN")) == 0, "NaN compares equal");

    // Infinity
    assert.writeOK(col.insert({ "decimal" : NumberDecimal("-Infinity")}), "Infinity write failed");
    assert.eq(col.find({ "decimal" : NumberDecimal("Infinity") }).count(), 1,
              "Infinity count wrong");
    assert.eq(col.find({ "decimal" : NumberDecimal("-Infinity") }).count(), 1,
              "Infinity count wrong");

    // Maximum Precision
    assert.eq(
        col.find({ "decimal" : NumberDecimal("12345678901234567890.12345678901234") }).count(), 1,
        "precision missing");

    col.drop();

    // Maximum and Minimum Values
    assert.writeOK(col.insert([
        { "max" : NumberDecimal("9999999999999999999999999999999999E6144") },
        { "min" : NumberDecimal("1E-6176") }
    ]));

    assert.eq(col.find({ "max" : NumberDecimal("9999999999999999999999999999999999E6144") }).count(),
              1);
    assert.eq(col.find({ "min" : NumberDecimal("1E-6176") }).count(),
              1);
}());
