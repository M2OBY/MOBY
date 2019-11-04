"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorparser_1 = require("./colorparser");
const lineparser_1 = require("./lineparser");
const pptelement_1 = require("airppt-models/pptelement");
/**
 * Parse the shape types and etc.
 */
class ShapeParser {
    static determineShapeType(prst) {
        //return the preset ppt shape type
        return prst;
    }
    static determineSpecialityType(element) {
        if (element["p:nvPicPr"]) {
            return pptelement_1.SpecialityType.Image;
        }
        return pptelement_1.SpecialityType.None;
    }
    static extractShapeElements(element) {
        return {
            fill: colorparser_1.default.getShapeFill(element),
            border: lineparser_1.default.extractLineElements(element),
            opacity: colorparser_1.default.getOpacity(element)
        };
    }
}
exports.default = ShapeParser;
