//Globalios funkcijos ir kintamieji

const builds = {
    prototype: 'Prototype',
    versions: [1, 2, 3, 4, 5, 6, 7, 8, 9]
};

const operation = {
    add: 'Add',
    subtract: 'Subtract',
    multiply: 'Multiply',
    divide: 'Divide',
    concatenate: 'Concatenate'
};

function testSettings() {
    beforeEach(() => {
        cy.viewport(1366, 768);  //Ekrano rezoliucijos keitimas
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false }); //Užblokuoti nereikalingas užklausas
        cy.visit(`https://testsheepnz.github.io/BasicCalculator`);
    });
}

function baseCode(a, b, c, d){
    cy.get(`#selectBuild`).select(a);
    cy.get(`#number1Field`).type(b);
    cy.get(`#number2Field`).type(c);
    cy.get(`#selectOperationDropdown`).select(d);
    cy.get(`#calculateButton`).click();
}

// a - buildo'as; b - 1 reiksme; c - 2 reiksme; d - operation; e - expectedResult
function getCorrectResult(a, b, c, d, e) {
    baseCode(a, b, c, d);
    cy.get(`#integerSelect`).then(($checkbox) => { // tikrina ar integersOnly paspaustas
        if (!$checkbox.is(`:checked`)) { // jeigu nepaspaustas
            cy.get(`#numberAnswerField`).should(`have.value`, e);
        } else { // jeigu paspaustas
            //throw new Error("Pažymėtas 'Integers Only'");
            cy.get(`#integerSelect`).click(); // atspaudzia
            cy.get(`#numberAnswerField`).should(`have.value`, e);
        }
    });
};

// reiksmes: a - buildo'as; b - 1 reiksme; c - 2 reiksme; d - operation
function getErrorMessage(a, b, c, d) {
    baseCode(a, b, c, d);
    cy.get(`#errorMsgField`).should(`exist`);
};

// a - buildo'as; b - 1 reiksme; c - 2 reiksme; d - operation; e - expectedResult
function integersOnlyCheck(a, b, c, d, e) {
    baseCode(a, b, c, d);
    cy.get(`#integerSelect`).then(($checkbox) => { // tikrina ar integersOnly paspaustas
        if (!$checkbox.is(`:checked`)) { // jeigu nepaspaustas
            cy.get(`#integerSelect`).click(); // uzdeda varnele
            cy.get(`#numberAnswerField`).should(`have.value`, e);
        } else { // jeigu paspaustas
            cy.get(`#numberAnswerField`).should(`have.value`, e);
        }
    });

};

// ------------------------------ Testu ir testavimo duomenu blokai --------------------------------------------------------------------------

//Testavimo duomenu blokas
const randomPosValue = () => Math.floor(Math.random() * 1e3);
const randomNegValue = () => Math.floor(Math.random() * 1e3) * -1;
const randomDecimalValue = () => (Math.random() * (100 - 1) + 1).toFixed(2);
const randomSymbols = () => {
    const allPossibleChars = '!@#$%^&*()_+[]{}|;:,.<>?`~' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomSymbols = '';

    for(let i = 0; i < 5; i++) {
        const picksRandomNumber = Math.floor(Math.random() * allPossibleChars.length);
        randomSymbols += allPossibleChars[picksRandomNumber];
    }
    return randomSymbols;
};

const posValues = [randomPosValue(), randomPosValue()];
const negValues = [randomNegValue(), randomNegValue()];
const symbolValue = [randomSymbols(), randomSymbols()];

const integersOnly = [parseFloat(randomDecimalValue()), parseFloat(randomDecimalValue())];
const integersOnlyResult = [[integersOnly[0] + integersOnly[1]], [integersOnly[0] - integersOnly[1]], [integersOnly[0] * integersOnly[1]], [integersOnly[0] / integersOnly[1]]];

// Add operatorius
function add(buildType){

    it(`Add: possitive values`, () => {
        getCorrectResult(buildType, posValues[0], posValues[1], operation.add, posValues[0] + posValues[1]); //teigiami skaiciai
    })
    it(`Add: negative values`, () => {
        getCorrectResult(buildType, negValues[0], negValues[1], operation.add, negValues[0] + negValues[1]); // neigiami skaiciai
    })
    it(`Add: letters`, () => { 
        getErrorMessage(buildType, symbolValue[0], symbolValue[1], operation.add); // raides ir simboliai
    })
    it(`Add: integersOnly checkbox`, () => {
         integersOnlyCheck(buildType, integersOnly[0], integersOnly[1], operation.add, Math.floor(integersOnlyResult[0])); // per kableli
    })
}

// Subtract operatorius
function subtract(buildType){

    it(`Subtract: possitive values`, () => {
        getCorrectResult(buildType, posValues[0], posValues[1], operation.subtract, posValues[0] - posValues[1]);
    })
    it(`Subtract: negative values`, () => {
        getCorrectResult(buildType, negValues[0], negValues[1], operation.subtract, negValues[0] - negValues[1]);
    })
    it(`Subtract: letters`, () => {
        getErrorMessage(buildType, symbolValue[0], symbolValue[1], operation.subtract);
    })
    it(`Subtract: integersOnly checkbox`, () => {
        integersOnlyCheck(buildType, integersOnly[0], integersOnly[1], operation.subtract, Math.floor(integersOnlyResult[1]));
    })
}

// Multiply operatorius
function multiply(buildType){

    it(`Multiply: possitive values`, () => {
        getCorrectResult(buildType, posValues[0], posValues[1], operation.multiply, posValues[0] * posValues[1]);
    })
    it(`Multiply: negative values`, () => {
        getCorrectResult(buildType, negValues[0], negValues[1], operation.multiply, negValues[0] * negValues[1]);
    })
    it(`Multiply: letters`, () => {
        getErrorMessage(buildType, symbolValue[0], symbolValue[1], operation.multiply);
    })
    it(`Multiply: integersOnly checkbox`, () => {
        integersOnlyCheck(buildType, integersOnly[0], integersOnly[1], operation.multiply, Math.floor(integersOnlyResult[2]));
    })
}

// Divide operatorius
function divide(buildType){

    it(`Divide: possitive values`, () => {
        getCorrectResult(buildType, posValues[0], posValues[1], operation.divide, posValues[0] / posValues[1]);
    })

    it(`Divide: negative values`, () => {
        getCorrectResult(buildType, negValues[0], negValues[1], operation.divide, negValues[0] / negValues[1]);
    })

    it(`Divide: letters`, () => {
        getErrorMessage(buildType, symbolValue[0], symbolValue[1], operation.divide);
    })

    it(`Divide: from 0`, () => {
        getErrorMessage(buildType, posValues[0], `0`, operation.divide);
    })

    it(`Divide: integersOnly checkbox`, () => {
        integersOnlyCheck(buildType, integersOnly[0], integersOnly[1], operation.divide, Math.floor(integersOnlyResult[3]));
    })
}

// Concatenate operatorius
function concatenate(buildType){

    it(`Concatenate: possitive values`, () => {
        getCorrectResult(buildType, posValues[0], posValues[1], operation.concatenate, "" + posValues[0] + posValues[1]);
    })

    it(`Concatenate: negative values`, () => {
        getCorrectResult(buildType, negValues[0], negValues[1], operation.concatenate, "" + negValues[0] + negValues[1]);
    })

    it(`Concatenate: decimals`, () => {
        getCorrectResult(buildType, integersOnly[0], integersOnly[1], operation.concatenate, "" + integersOnly[0] + integersOnly[1]);
    })

    it(`Concatenate: letters`, () => {
        getCorrectResult(buildType, symbolValue[0], symbolValue[1], operation.concatenate, "" + symbolValue[0] + symbolValue[1]);
    })

}

//Testu vykdymas
function runTests(buildType){
    add(buildType);
    subtract(buildType);
    multiply(buildType);
    divide(buildType);
    concatenate(buildType);
}

// --------------------------------------   describe   --------------------------------------------------------- 

describe(`Calculator tests`, () => {
    [builds.prototype,...builds.versions].forEach((buildType) => {
        describe(`Build: ${buildType}`, () => {
            testSettings();
            runTests(buildType);
        });
    })
})