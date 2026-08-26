import sql from "@/app/api/utils/sql";

/**
 * Send notification to all admin users
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} notificationType - Type: 'info', 'success', 'warning', 'error', 'new_creator', 'new_contract', 'new_platform_contract', 'new_partner'
 * @param {number|null} relatedId - ID of related entity (optional)
 * @param {string|null} relatedType - Type of related entity: 'creator', 'contract', 'platform_contract', 'partner' (optional)
 */
export async function sendAdminNotification(
  title,
  message,
  notificationType = "info",
  relatedId = null,
  relatedType = null,
) {
  try {
    // Get all active admin users
    const admins = await sql`
      SELECT id FROM admin_users WHERE is_active = true
    `;

    if (admins.length === 0) {
      console.log(
        "[Admin Notifications] No active admins found, skipping notification",
      );
      return;
    }

    // Insert notification for each admin
    const notifications = [];
    for (const admin of admins) {
      notifications.push(sql`
        INSERT INTO admin_notifications (
          admin_id,
          title,
          message,
          notification_type,
          related_id,
          related_type,
          is_read,
          created_at
        )
        VALUES (
          ${admin.id},
          ${title},
          ${message},
          ${notificationType},
          ${relatedId},
          ${relatedType},
          false,
          NOW()
        )
      `);
    }

    // Execute all inserts
    await sql.transaction(notifications);

    console.log(
      `[Admin Notifications] Sent "${title}" to ${admins.length} admin(s)`,
    );
  } catch (error) {
    console.error("[Admin Notifications] Failed to send notification:", error);
    // Don't throw - we don't want to break the main operation if notification fails
  }
}

/**
 * Send notification about a new creator signup
 */
export async function notifyNewCreator(creatorId, creatorName, creatorEmail) {
  await sendAdminNotification(
    "🎉 New Creator Registered",
    `${creatorName} (${creatorEmail}) has created a new creator account and is awaiting review.`,
    "new_creator",
    creatorId,
    "creator",
  );
}

/**
 * Send notification about a new contract being signed
 */
export async function notifyContractSigned(
  contractId,
  creatorName,
  revenueShare,
) {
  await sendAdminNotification(
    "✍️ Contract Signed",
    `${creatorName} has signed their master contract (${revenueShare}% revenue share).`,
    "new_contract",
    contractId,
    "contract",
  );
}

/**
 * Send notification about a new platform contract submission
 */
export async function notifyPlatformContractSubmitted(
  contractId,
  creatorName,
  platform,
) {
  await sendAdminNotification(
    "📄 Platform Contract Submitted",
    `${creatorName} has submitted a ${platform} platform contract for review.`,
    "new_platform_contract",
    contractId,
    "platform_contract",
  );
}

/**
 * Send notification about a new partner registration
 */
export async function notifyNewPartner(partnerId, partnerName, partnerEmail) {
  await sendAdminNotification(
    "🤝 New Partner Registered",
    `${partnerName} (${partnerEmail}) has registered as a new partner.`,
    "new_partner",
    partnerId,
    "partner",
  );
}

/**
 * Send notification when an earnings batch is uploaded
 */
export async function notifyEarningsUploaded(
  recordsCount,
  totalAmount,
  creatorsCount,
  filename,
  uploadedBy,
) {
  await sendAdminNotification(
    "💰 Earnings Batch Uploaded",
    `${recordsCount} earning record(s) for ${creatorsCount} creator(s) totaling $${parseFloat(totalAmount).toFixed(2)} have been uploaded from "${filename}" by ${uploadedBy || "Admin"}.`,
    "success",
    null,
    "earnings",
  );
}
