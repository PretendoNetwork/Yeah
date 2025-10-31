// * https://github.com/PretendoNetwork/juxtaposition/blob/1cd5297b86a25e62941f60d2a97f5fcb99ea89a3/apps/juxtaposition-ui/src/services/juxt-web/views/common.tsx#L3-L5

/**
 * Creates an inlined `<script>` tag with the provided contents
 *
 * @param props - An object containing a `src` field, which is the JavaScript meant to be inlined
 * @returns JSX Element
 */
export default function InlineScript(props: { src: string }) {
	return <script dangerouslySetInnerHTML={{ __html: props.src }} />;
}
