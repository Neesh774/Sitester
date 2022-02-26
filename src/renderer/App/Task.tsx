import * as React from "react"
import { useEnvironment } from "../Environment"
import { Task, taskOptions } from "../RendererState"
import { TaskDetails } from "./TaskDetails"
import { NativeSelect, ActionIcon, Container, Alert } from "@mantine/core"
import { BiTrash, BiXCircle } from "react-icons/bi"
import { useApp } from "../RendererApp"

export function TaskItem({ task, index }: { task: Task; index: number }) {
	const { app } = useEnvironment()
	const state = useApp()
	const [selectedType, setSelectedType] = React.useState(
		taskOptions.find((t) => t.name === task.type)
	)

	return (
		<Container
			style={{
				width: "100%",
				borderRadius: "8px",
				margin: "0.5rem 0",
				padding: "0.5rem 0.6rem",
				display: "flex",
				flexDirection: "column",
			}}
			sx={(theme) => ({
				backgroundColor:
					theme.colors[selectedType?.color ?? "gray"][1] +
					(state.submitStatus === "submitting" &&
					index === state.runningTaskIndex
						? "90"
						: "60"),
			})}
		>
			{state.submitStatus === "notSubmitting" &&
				state.lastError &&
				state.lastError.index === index && (
					<Alert
						icon={<BiXCircle size={16} />}
						title={`Error on task ${index + 1}`}
						style={{ marginBottom: "0.5rem" }}
						color="red"
					>
						{state.lastError.message}
					</Alert>
				)}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "0.2rem",
				}}
			>
				<NativeSelect
					onChange={(e) => {
						app.dispatch.editTask(
							{ ...task, type: e.target.value } as any,
							index
						)
						setSelectedType(taskOptions.find((t) => t.name === e.target.value))
					}}
					value={task.type}
					data={taskOptions.map((o) => ({ label: o.name, value: o.name }))}
					placeholder="Pick a task"
					label="Task"
				/>
				<ActionIcon color="red" onClick={() => app.dispatch.removeTask(index)}>
					<BiTrash style={{ width: 16, height: 16 }} />
				</ActionIcon>
			</div>
			<TaskDetails
				task={task}
				index={index}
				color={selectedType?.color ?? "gray"}
			/>
		</Container>
	)
}
