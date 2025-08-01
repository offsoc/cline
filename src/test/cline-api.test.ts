import { describe, it, beforeEach, afterEach } from "mocha"
import * as should from "should"
import * as vscode from "vscode"
import * as sinon from "sinon"
import type { ClineAPI } from "../exports/cline"

describe("ClineAPI Integration Tests", () => {
	let api: ClineAPI | undefined
	let sandbox: sinon.SinonSandbox
	let outputChannel: vscode.OutputChannel
	let originalShowInformationMessage: typeof vscode.window.showInformationMessage

	beforeEach(async () => {
		sandbox = sinon.createSandbox()

		// Create a test output channel
		outputChannel = vscode.window.createOutputChannel("Cline API Test")

		// Store original function
		originalShowInformationMessage = vscode.window.showInformationMessage

		// Stub showInformationMessage to prevent UI popups during tests
		sandbox.stub(vscode.window, "showInformationMessage").resolves()

		// Wait for extension to be ready
		const extension = vscode.extensions.getExtension("saoudrizwan.claude-dev")
		if (extension && !extension.isActive) {
			await extension.activate()
		}

		// Get the API from the extension
		api = extension?.exports
	})

	afterEach(() => {
		sandbox.restore()
		outputChannel.dispose()
	})

	describe("Extension API Export", () => {
		it("should export the ClineAPI", () => {
			should.exist(api)
			api!.should.have.property("startNewTask")
			api!.should.have.property("sendMessage")
			api!.should.have.property("pressPrimaryButton")
			api!.should.have.property("pressSecondaryButton")
		})
	})

	describe("startNewTask", () => {
		it("should start a new task with description", async function () {
			this.timeout(10000) // Increase timeout for integration test

			if (!api) {
				this.skip()
				return
			}

			// Start a new task
			await api.startNewTask("Test task from integration test")

			// Give some time for the task to initialize
			await new Promise((resolve) => setTimeout(resolve, 1000))

			// The task should be started (we can't easily verify internal state in integration test)
			// But we can verify no errors were thrown
			should.exist(api)
		})

		it("should handle task with images", async function () {
			this.timeout(10000)

			if (!api) {
				this.skip()
				return
			}

			// Create a test image path (doesn't need to exist for this test)
			const imagePaths = ["/test/image1.png", "/test/image2.png"]

			// Start a new task with images
			await api.startNewTask("Test task with images", imagePaths)

			// Give some time for the task to initialize
			await new Promise((resolve) => setTimeout(resolve, 1000))

			should.exist(api)
		})
	})

	describe("sendMessage", () => {
		it("should handle sending message when no task is active", async function () {
			if (!api) {
				this.skip()
				return
			}

			// Try to send a message without an active task
			// This should not throw an error
			await api.sendMessage("Test message")

			should.exist(api)
		})

		it("should handle sending message with images", async function () {
			if (!api) {
				this.skip()
				return
			}

			const imagePaths = ["/test/image.png"]

			// Try to send a message with images
			await api.sendMessage("Test message with image", imagePaths)

			should.exist(api)
		})
	})

	describe("Button Press Methods", () => {
		it("should handle primary button press", async function () {
			if (!api) {
				this.skip()
				return
			}

			// Press primary button (should not throw even without active task)
			await api.pressPrimaryButton()

			should.exist(api)
		})

		it("should handle secondary button press", async function () {
			if (!api) {
				this.skip()
				return
			}

			// Press secondary button (should not throw even without active task)
			await api.pressSecondaryButton()

			should.exist(api)
		})
	})

	describe("Task Flow Integration", () => {
		it("should handle complete task flow", async function () {
			this.timeout(15000) // Longer timeout for full flow

			if (!api) {
				this.skip()
				return
			}

			// 1. Start a new task
			await api.startNewTask("Integration test task")
			await new Promise((resolve) => setTimeout(resolve, 1000))

			// 2. Send a message
			await api.sendMessage("Please acknowledge this test message")
			await new Promise((resolve) => setTimeout(resolve, 1000))

			// 3. Press buttons (simulating user interaction)
			await api.pressPrimaryButton()
			await new Promise((resolve) => setTimeout(resolve, 500))

			// The test passes if no errors were thrown
			should.exist(api)
		})
	})
})
