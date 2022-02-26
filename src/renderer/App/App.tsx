import {
	Button,
	Overlay,
	TextInput,
	Title,
	Timeline,
	ActionIcon,
	Accordion,
	ThemeIcon,
} from "@mantine/core"
import * as React from "react"
import { BiPlus, BiTrash } from "react-icons/bi"
import { useEnvironment } from "../Environment"
import { useApp } from "../RendererApp"
import { TaskItem } from "./TaskItem"
import { taskOptions } from "../RendererState"

export function App() {
	const state = useApp((state) => state)
	console.log({ state })
	const { app } = useEnvironment()
	const [testSite, setTestSite] = React.useState("")
	const [taskErrors, setTaskErrors] = React.useState(false)
	const siteInput = React.useRef<HTMLInputElement | null>(null)

	React.useEffect(() => {
		setTaskErrors(
			state.test.every((task) => {
				return !Object.values(task).every((v) => {
					return v.length > 0
				})
			})
		)
	})

	return (
		<div style={{ display: "flex", height: "100%" }}>
			<div
				className="tasks"
				style={{
					width: "30%",
					borderRight: "1px solid #aaa",
					padding: "2rem 0 0",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<div
					style={{
						overflowY: "auto",
						height: "100%",
						padding: "0 1rem",
						paddingBottom: "1rem",
						marginBottom: "0.1rem",
					}}
				>
					<Title order={3} style={{ marginBottom: "0.4rem" }}>
						Tasks
					</Title>
					<Accordion disableIconRotation>
						{state.test.map((task, i) => {
							const taskSettings = taskOptions.find((t) => t.name === task.type)
							return (
								<Accordion.Item
									key={i}
									label={
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
											}}
										>
											<Title order={4}>Task {i + 1}</Title>
											<i style={{ fontSize: "0.8rem", color: "gray" }}>
												{taskSettings?.name}
											</i>
										</div>
									}
									icon={taskSettings?.icon}
								>
									<TaskItem index={i} task={task} />
								</Accordion.Item>
							)
						})}
					</Accordion>
					<Button
						onClick={() => {
							app.dispatch.appendTask({ type: "clickOnElement", selector: "" })
						}}
						variant="outline"
						size="xs"
						leftIcon={<BiPlus />}
						style={{ marginTop: "1rem" }}
					>
						New Task
					</Button>
				</div>
				<div
					style={{
						padding: "0.6rem 1rem",
						boxShadow: " 0px -2px 4px -2.5px rgba(0,0,0,0.75)",
						width: "100%",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Button
						onClick={() => {
							app.dispatch.startSubmittingTest()
						}}
						variant="gradient"
						gradient={{ from: "indigo", to: "cyan" }}
						disabled={taskErrors}
						style={{ transition: "ease-in-out 0.2s" }}
						loading={state.submitStatus === "submitting"}
					>
						Submit
					</Button>
					<Button
						onClick={() => {
							app.dispatch.clearTasks()
						}}
						style={{ display: "flex", transition: "ease-in-out 0.2s" }}
						leftIcon={<BiTrash size={16} />}
						variant="outline"
						color="gray"
						disabled={state.test.length === 0}
						size="xs"
					>
						Clear
					</Button>
				</div>
			</div>
			<div
				className="preview"
				style={{
					display: "flex",
					flexDirection: "column",
					width: "70%",
					padding: "2rem 4rem",
				}}
			>
				<div
					className="test-site"
					style={{
						display: "flex",
						width: "100%",
						margin: "0.4rem 0",
						padding: "0 0.6rem",
					}}
				>
					<TextInput
						ref={siteInput}
						style={{ width: "100%" }}
						type="url"
						size="xs"
					/>
					<Button
						style={{ marginLeft: "0.2rem" }}
						onClick={(e: React.MouseEvent) =>
							setTestSite(siteInput.current ? siteInput.current.value : "")
						}
						size="xs"
					>
						Load
					</Button>
				</div>
				<iframe
					id="iframe"
					style={{
						display: "flex",
						width: "100%",
						height: "100%",
						border: "1px solid black",
					}}
					src={testSite}
				></iframe>
			</div>
		</div>
	)
}
