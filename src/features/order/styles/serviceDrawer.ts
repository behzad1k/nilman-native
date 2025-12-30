import { colors } from "@/src/styles/theme/colors";
import { StyleSheet } from "react-native";

export const serviceDrawerStyles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	servicesList: {
		flex: 1,
		height: 400,
		gap: 10,
		marginBottom: 20,
		overflowY: "auto",
	},
	attrContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
	},
	priceContainer: {
		alignItems: "flex-end",
		gap: 8,
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	quantityContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	quantityButton: {
		padding: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	quantityInput: {
		writingDirection: "rtl",
		width: 40,
		textAlign: "center",
		fontSize: 14,
		color: "#333",
		paddingVertical: 4,
	},
	confirmButton: {
		position: "static",
		backgroundColor: colors.green,
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 16,
	},
	confirmButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
