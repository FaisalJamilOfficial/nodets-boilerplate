/**
 * Converts a given text to camelCase.
 *
 * This function transforms a string into camelCase by converting it to
 * lowercase and replacing non-alphanumeric characters and their following
 * character with its uppercase equivalent.
 *
 * @param {string} text - The string to convert to camelCase.
 * @returns {string} The camelCase version of the given string.
 */
exports.toCamelCase = function toCamelCase(text) {
  return text
    .toLowerCase() // Convert the text to lowercase
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase()); // Replace non-alphanumeric characters and capitalize the following character
};

/**
 * Converts a given text to kebab-case.
 *
 * This function transforms a string into kebab-case by converting
 * the entire string to lowercase and then replacing non-alphanumeric
 * characters with hyphens. Any leading or trailing hyphens are removed.
 *
 * @param {string} text - The input text to be converted.
 * @returns {string} - The kebab-case version of the input text.
 */
exports.toKebabCase = function toKebabCase(text) {
  return text
    .toLowerCase() // Convert the text to lowercase
    .replace(/[^a-zA-Z0-9]+/g, "-") // Replace non-alphanumeric characters with a hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
};

/**
 * Converts a given text to PascalCase.
 *
 * This function transforms a string into PascalCase by converting
 * the entire string to lowercase and then capitalizing the first
 * letter of each word. Non-alphanumeric characters are treated as
 * word boundaries and any subsequent character is capitalized.
 *
 * @param {string} text - The input text to be converted.
 * @returns {string} - The PascalCase version of the input text.
 */
exports.toPascalCase = function toPascalCase(text) {
  return text
    .toLowerCase() // Convert the text to lowercase
    .replace(/(?:^|\s|[^a-zA-Z0-9]+)(\w)/g, (_match, chr) => chr.toUpperCase()); // Capitalize the first letter of each word
};

/**
 * Converts a given text to snake_case.
 *
 * This function takes a string and transforms it into snake_case by converting
 * all characters to lowercase, replacing non-alphanumeric characters with
 * underscores, and removing any leading or trailing underscores.
 *
 * @param {string} text - The input text to be converted.
 * @returns {string} - The snake_case version of the input text.
 */
exports.toSnakeCase = function toSnakeCase(text) {
  return text
    .toLowerCase() // Convert the text to lowercase
    .replace(/[^a-zA-Z0-9]+/g, "_") // Replace non-alphanumeric characters with underscores
    .replace(/^_+|_+$/g, ""); // Remove leading or trailing underscores
};

/**
 * Returns the plural form of the given word. The rules for pluralization
 * are as follows:
 *
 * 1. If the word is an irregular plural, use the corresponding plural form.
 * 2. If the word ends in 'y' (but not 'ay', 'oy', 'ey', 'uy', 'iy'), change
 *    the 'y' to 'ies'.
 * 3. If the word ends in 's', 'x', 'z', 'ch', or 'sh', add 'es'.
 * 4. If the word ends in 'f' or 'fe', change the 'f' or 'fe' to 'ves'.
 * 5. Otherwise, just add 's'.
 */
exports.pluralize = function pluralize(word) {
  const irregularPlurals = {
    child: "children",
    person: "people",
    man: "men",
    woman: "women",
    tooth: "teeth",
    foot: "feet",
    mouse: "mice",
    goose: "geese",
  };

  // Handle irregular plurals
  if (irregularPlurals[word.toLowerCase()]) {
    return irregularPlurals[word.toLowerCase()];
  }

  // Handle words that end with 'y' (e.g., city -> cities)
  if (word.match(/[^aeiou]y$/)) {
    return word.replace(/y$/, "ies");
  }

  // Handle words that end with 's', 'x', 'z', 'ch', or 'sh' (e.g., box -> boxes)
  if (word.match(/(s|x|z|ch|sh)$/)) {
    return word + "es";
  }

  // Handle words that end with 'f' or 'fe' (e.g., leaf -> leaves)
  if (word.match(/(f|fe)$/)) {
    return word.replace(/(f|fe)$/, "ves");
  }

  // Default rule: just add 's'
  return word + "s";
};

/**
 * Returns the singular form of a given word.
 *
 * The function takes a given word, and returns its singular form according to
 * the following rules:
 * 1. If the word is an irregular plural, return its singular form according to
 *    the irregularPlurals object.
 * 2. If the word ends in 'ies', change the 'ies' to 'y'.
 * 3. If the word ends in 'es', change the 'es' to an empty string.
 * 4. If the word ends in 'ves', change the 'ves' to 'f'.
 * 5. If the word ends in 's' and does not end in 'ss', change the 's' to an empty
 *    string.
 * 6. Otherwise, return the word as is.
 *
 * @param {string} word The word to be converted to its singular form.
 * @returns {string} The singular form of the given word.
 */
exports.singularize = function singularize(word) {
  const irregularSingulars = {
    children: "child",
    people: "person",
    men: "man",
    women: "woman",
    teeth: "tooth",
    feet: "foot",
    mice: "mouse",
    geese: "goose",
  };

  // Handle irregular plurals
  if (irregularSingulars[word.toLowerCase()]) {
    return irregularSingulars[word.toLowerCase()];
  }

  // Handle words that end with 'ies' (e.g., cities -> city)
  if (word.match(/ies$/)) {
    return word.replace(/ies$/, "y");
  }

  // Handle words that end with 'es' (e.g., boxes -> box, churches -> church)
  if (word.match(/(ses|xes|zes|ches|shes)$/)) {
    return word.replace(/es$/, "");
  }

  // Handle words that end with 'ves' (e.g., leaves -> leaf)
  if (word.match(/ves$/)) {
    return word.replace(/ves$/, "f");
  }

  // Handle words that end with 's' (e.g., cars -> car)
  if (word.match(/s$/) && !word.match(/ss$/)) {
    return word.replace(/s$/, "");
  }

  // Return the word if it doesn't match any rule
  return word;
};

/**
 * Returns the indefinite article ("a" or "an") that should be used before
 * the given word. The function takes into account the following rules:
 *
 * 1. If the word starts with a vowel sound, use "an".
 * 2. If the word starts with a consonant sound, use "a".
 * 3. If the word is one of the following exceptions, use "an" despite starting
 *    with a consonant: honest, hour, honor, heir.
 * 4. If the word is one of the following exceptions, use "a" despite starting
 *    with a vowel: university, unicorn, euro, one, useful, unit.
 *
 * @param {string} word The word to determine the indefinite article for.
 * @returns {string} The indefinite article ("a" or "an") that should be used
 * before the given word.
 */
exports.getIndefiniteArticle = function getIndefiniteArticle(word) {
  if (!word || typeof word !== "string") return "a";

  const lowerWord = word.toLowerCase();

  // Exceptions where "an" is used despite starting with a consonant
  const anExceptions = ["honest", "hour", "honor", "heir"];

  // Exceptions where "a" is used despite starting with a vowel
  const aExceptions = [
    "university",
    "unicorn",
    "euro",
    "one",
    "useful",
    "unit",
  ];

  if (anExceptions.includes(lowerWord)) {
    return "an";
  }

  if (aExceptions.includes(lowerWord)) {
    return "a";
  }

  const firstChar = lowerWord.charAt(0);

  // Use 'an' if the word starts with a vowel sound
  if ("aeiou".includes(firstChar)) {
    return "an";
  }

  return "a";
};
