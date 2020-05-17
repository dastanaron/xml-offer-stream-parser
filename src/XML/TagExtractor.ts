import { Writable } from 'stream';

const STATES = {
    filling: 1,
    nothing: 0,
};

export default class TagExtractor extends Writable
{
    protected buffer: string;
    protected state: number;
    private readonly tagName: string;

    constructor(tagName: string) {
        super();
        this.tagName = tagName;
        this.buffer = '';
        this.state = STATES.nothing;
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void
    {
        const stringChunk = typeof chunk !== 'string' ? chunk.toString() : chunk;

        const patternOpenTag = new RegExp(`\<${this.tagName}\s*`, 'gmi')
        const foundOpenTag = stringChunk.search(patternOpenTag);

        const patternCloseTag = new RegExp(`\<\/${this.tagName}`);
        const foundCloseTag = stringChunk.search(patternCloseTag);

        if (foundOpenTag > -1 && foundCloseTag > -1) {
            this._processSeparateBothTags(foundOpenTag, foundCloseTag, stringChunk);
        } else if (foundOpenTag > -1) {
            this._processOpenTag(foundOpenTag, stringChunk);
        } else if (foundCloseTag > -1) {
            this._processCloseTag(foundCloseTag, stringChunk);
        } else {
            if (this.state === STATES.filling) {
                this.buffer += stringChunk;
            }
        }

        callback();
    }

    _processOpenTag(position: number, chunk: string): void
    {
        this.buffer += chunk.slice(position, chunk.length);
        this.state = STATES.filling;
    }

    _processCloseTag(position: number, chunk: string): void
    {
        this.buffer += chunk.slice(0, position) + `</${this.tagName}>`;
        this._emitOnData();
        this.state = STATES.nothing;
        this.buffer = '';
    }

    _processSeparateBothTags(positionOpen: number, positionClose: number, chunk: string): void
    {
        this._processCloseTag(positionClose, chunk);
        this._processOpenTag(positionOpen, chunk);
    }

    _emitOnData() {
        this.emit('data', this.buffer);
    }
}
