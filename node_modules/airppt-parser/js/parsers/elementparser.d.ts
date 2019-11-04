import { PowerpointElement } from "airppt-models/pptelement";
/**
 * Entry point for all Parsers
 */
declare class PowerpointElementParser {
    private slideShowGlobals;
    private slideShowTheme;
    private element;
    constructor(slideShowGlobals: any, slideShowTheme: any);
    getProcessedElement(rawElement: any, slideRelationships: any): PowerpointElement;
}
export default PowerpointElementParser;
