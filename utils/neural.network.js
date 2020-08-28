const natural = require('natural');
const BrainJs = require('brain.js');
const TrainingSet = require('../data/training-data.json');
var network = "";

function buildWordDictionary(trainingData) {
    const tokenisedArray = trainingData.map(item => {
        const tokens = item.phrase.split(' ');
        return tokens.map(token => natural.PorterStemmer.stem(token));
    })

    const flattenedArray = [].concat.apply([], tokenisedArray);
    return flattenedArray.filter((item, pos, self) => self.indexOf(item) == pos);
}

const dictionary = buildWordDictionary(TrainingSet);

function encode(phrase) {
    const phraseTokens = phrase.split(' ');
    const encodedPhrase = dictionary.map(word => phraseTokens.includes(word) ? 1 : 0);

    return encodedPhrase;
}

const encodedTrainingSet = TrainingSet.map(dataSet => {
    const encodedValue = encode(dataSet.phrase);
    return { input: encodedValue, output: dataSet.result };
})

function init() {
    network = new BrainJs.NeuralNetwork();
    network.train(encodedTrainingSet);
}

function isQuestion(data) {
    const encoded = encode(data);
    if (encoded.length < 15) {
        num = network.run(encoded);
        if (num.question > 0.7)
            return true;
        return false;
    }
    return false;
}

module.exports = { init, isQuestion };