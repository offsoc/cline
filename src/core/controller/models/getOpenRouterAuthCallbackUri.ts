import { HostProvider } from "@/hosts/host-provider"
import { Controller } from ".."
import { EmptyRequest } from "@shared/proto/cline/common"
import { OpenRouterAuthCallbackUriResponse } from "@shared/proto/cline/models"

/**
 * Fetches an auth callback for Openrouter
 * @returns String of URL
 */
export async function getOpenRouterAuthCallbackUri(_: Controller, __: EmptyRequest): Promise<OpenRouterAuthCallbackUriResponse> {
	const callbackHost = await HostProvider.get().getCallbackUri()
	return OpenRouterAuthCallbackUriResponse.create({ uri: `${callbackHost}/openrouter` })
}
