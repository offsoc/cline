export interface FocusChainSettings {
	// Enable/disable the focus chain feature
	enabled: boolean
	// Interval (in messages) to remind Cline about focus chain
	remindClineInterval: number
}

export const DEFAULT_focus_chain_SETTINGS: FocusChainSettings = {
	enabled: false,
	remindClineInterval: 6,
}
