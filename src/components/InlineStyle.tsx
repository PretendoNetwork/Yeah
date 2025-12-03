// * https://github.com/PretendoNetwork/juxtaposition/blob/1cd5297b86a25e62941f60d2a97f5fcb99ea89a3/apps/juxtaposition-ui/src/services/juxt-web/views/common.tsx#L7-L8

import type { JSX } from 'react';

/**
 * Creates an inlined `<style>` tag with the provided contents
 *
 * @param props - An object containing a `src` field, which is the CSS styles meant to be inlined
 * @returns JSX Element
 */
export default function InlineStyle(props: { src: string }): JSX.Element {
	return <style dangerouslySetInnerHTML={{ __html: props.src }} />;
}
